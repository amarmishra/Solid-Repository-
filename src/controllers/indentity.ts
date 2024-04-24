import { Request, Response, NextFunction, Router } from "express";
import Controller from "../utils/interfaces/controller.interface";
import ContactService from '../services/contact.service'
import HttpException from "../utils/exceptions";
import Contact from "../models/contact";
import { formatResponse, isPresentInContactTrail, updateContactTrailWithLinkPrcedence, secondaryContactLinkedIdsMatchPrimaryId } from "../utils/helpers";
class IdentityController implements Controller {
    path: string = '/identity';
    router: Router = Router();
    constructor() {
        this.intializeRoutes();
    }
    private intializeRoutes() {
        this.router.post(this.path, this.identityController)
    }
    private async identityController(req: Request, res: Response, next: NextFunction) {
        try {

            const { email, phoneNumber, cleanEmail = email || null, cleanPhone = phoneNumber || null } = req.body;

            if (!email && !phoneNumber) {
                throw new HttpException(400, 'Bad Request. Cannot proceed with identification')
            }

            let contactTrail = await ContactService.findContactWithEmailOrPhoneNumber({ email: cleanEmail, phoneNumber: cleanPhone } as Contact)

            //Case:no contat exits,create a primary contact
            if (contactTrail.length === 0) {
                const contact = await ContactService.createContact({ email: cleanEmail, phoneNumber: cleanPhone, linkPrecedence: 'primary' } as Contact)
                contactTrail.push(contact);
                const formattedResponse = formatResponse(contactTrail)
                return res.status(200).json({ ...formattedResponse })
            }

            let primaryContacts = contactTrail.filter((contact) => { return contact.linkPrecedence === 'primary' })

            //Case : contactTrail has more than one primary contacts 
            if (primaryContacts.length > 1) {
                //get Primary Contacts Ids
                const primaryContactIds = primaryContacts.map((contact) => { return contact.id })

                const updatedContact = await ContactService.updateContact({ id: primaryContactIds[1], linkedId: primaryContactIds[0], linkPrecedence: 'secondary' } as Contact)
                contactTrail = updateContactTrailWithLinkPrcedence(contactTrail, updatedContact)
                return res.status(200).json(formatResponse(contactTrail))
            }

            let secondaryContacts = contactTrail.filter((contact) => { return contact.linkPrecedence === 'secondary' })

            if (primaryContacts.length === 0 && secondaryContacts.length !== 0) {
                //fetch primary contact for secondaryContact linkedId
                const { linkedId } = secondaryContacts[0]
                primaryContacts = await ContactService.findPrimaryContactFromSecondaryLinkedId({ linkedId, linkPrecedence: 'primary' } as Contact)

            }
            /*Special case: 
                Only one primary and secondary contacts are available
                But primary id does not match secondary contacts linkId
            */
            else if (primaryContacts.length !== 0 && secondaryContacts.length !== 0 && !secondaryContactLinkedIdsMatchPrimaryId(secondaryContacts, primaryContacts)) {
                const primaryContactId = primaryContacts.map((contact) => { return contact.id })[0]
                const unmatchedSecondaryContacts = secondaryContacts.filter((secondaryContact) => {
                    return secondaryContact.linkedId !== primaryContactId
                })
                const unmatchedSecondaryContactsLinkedId = unmatchedSecondaryContacts[0].linkedId

                if (primaryContactId > unmatchedSecondaryContactsLinkedId) {
                    //update primary contact to secondary contact with linkedId = unmatchedSecondaryContactsLinkedId
                    await ContactService.updateContact({ id: primaryContactId, linkedId: unmatchedSecondaryContactsLinkedId, linkPrecedence: 'secondary' } as Contact)
                }
                //upadate secondary contacts linkedId with primaryId + updated contact with id = unmatchedSecondaryContactsLinkedId as secondary(with linkId= primaryId)
                await
                    Promise.all([...(unmatchedSecondaryContacts.map((contact) => { return ContactService.updateContact({ id: contact.id, linkedId: primaryContactId } as Contact) })), ContactService.updateContact({ id: unmatchedSecondaryContactsLinkedId, linkedId: primaryContactId, linkPrecedence: 'secondary' } as Contact)])
            }

            //get Secondary Contacts where linkedId is primary 
            const secondaryContactsFromPrimary = await ContactService.findSecondaryContactsFromPrimaryId({ id: primaryContacts[0]?.id, linkPrecedence: 'secondary' } as Contact)
            contactTrail = primaryContacts.concat(secondaryContactsFromPrimary)
            //Case: contactTrail has one primary contact and contactTrail does not have same value as requested
            if (!isPresentInContactTrail({ email: cleanEmail, phoneNumber: cleanPhone } as Contact, contactTrail)) {
                //get Primary Contacts Ids
                const primaryContactIds = contactTrail.filter((contact) => { return contact.linkPrecedence === 'primary' }).map((contact) => { return contact.id })

                const contact = await ContactService.createContact({ email, phoneNumber, linkPrecedence: 'secondary', linkedId: primaryContactIds[0] } as Contact)
                contactTrail.push(contact)
                return res.status(200).json(formatResponse(contactTrail))
            }
            return res.status(200).json(formatResponse(contactTrail))
        } catch (error) {
            next(error)
        }
    }

}

export default IdentityController