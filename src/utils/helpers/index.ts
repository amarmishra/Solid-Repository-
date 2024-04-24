import Contact from "../../models/contact";
import { IResponseAccumulator } from '../interfaces/response.interface'
export function formatResponse(contactTrail: Contact[]) {

    const accumulatorResponse = contactTrail.reduce<IResponseAccumulator | undefined>((acc, contact) => {
        if (acc !== undefined) {
            if (contact.linkPrecedence === 'primary') {
                acc.primaryContatctId = contact.id;
            }
            if (contact.linkPrecedence === 'secondary') {
                acc.secondaryContactIds.push(contact.id);
            }
            if (contact.email && !acc.emails?.includes(contact.email)) {
                acc.emails?.push(contact.email)
            }
            if (contact.phoneNumber && !acc.phoneNumbers?.includes(contact.phoneNumber)) {
                acc.phoneNumbers?.push(contact.phoneNumber)
            }
        }
        return acc;

    }
        , { primaryContatctId: null, emails: [], phoneNumbers: [], secondaryContactIds: [] })

    return { contact: { ...accumulatorResponse } }
}


export function isPresentInContactTrail(val: Contact, arr: Contact[]) {
    return (arr.some(function (arrVal) {
        return (val.email === arrVal.email) || (val.phoneNumber == arrVal.phoneNumber);
    }));
}

export function updateContactTrailWithLinkPrcedence(arr: Contact[], val: Contact) {
    return arr.map((arrVal) => {
        if (arrVal.id === val.id) {
            return { ...arrVal, linkPrecedence: val.linkPrecedence }
        }
        return arrVal
    })

}

export function secondaryContactLinkedIdsMatchPrimaryId(secondaryContacts:Contact[], primaryContacts: Contact[] ){
    return secondaryContacts[0].linkedId === primaryContacts[0].id
 }