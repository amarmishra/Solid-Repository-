import { Repository } from "typeorm";
import Contact from '../models/contact'
import { contactRepo } from "../repository";

class ContactService {
    constructor(public Contact: Repository<Contact>) {
    }

    async createContact(contact: Contact) {
        return this.Contact.save({ ...contact });
    }

    async findContact(contact: Contact){
        return this.Contact.find(({ where:{...contact}}));
    }

    async findContactWithEmailOrPhoneNumber(contact: Contact) {
        return this.Contact.find({ where: [{ email: contact.email }, { phoneNumber: contact.phoneNumber }] })
    }

    async findPrimaryContactFromSecondaryLinkedId(contact: Contact) {
        return this.Contact.find({ where: { linkPrecedence: contact.linkPrecedence , id: contact.linkedId} })
    }

    async findSecondaryContactsFromPrimaryId(contact: Contact) {
        return this.Contact.find({ where: { linkPrecedence: contact.linkPrecedence , linkedId: contact.id} })
    }

    async updateContact(updatedData: Contact) {
        return this.Contact.save(updatedData)
    }

}
export default new ContactService(contactRepo);