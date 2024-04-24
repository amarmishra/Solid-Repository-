"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const repository_1 = require("../repository");
class ContactService {
    constructor(Contact) {
        this.Contact = Contact;
    }
    createContact(contact) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.Contact.save(Object.assign({}, contact));
        });
    }
    findContact(contact) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.Contact.find(({ where: Object.assign({}, contact) }));
        });
    }
    findContactWithEmailOrPhoneNumber(contact) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.Contact.find({ where: [{ email: contact.email }, { phoneNumber: contact.phoneNumber }] });
        });
    }
    findPrimaryContactFromSecondaryLinkedId(contact) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.Contact.find({ where: { linkPrecedence: contact.linkPrecedence, id: contact.linkedId } });
        });
    }
    findSecondaryContactsFromPrimaryId(contact) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.Contact.find({ where: { linkPrecedence: contact.linkPrecedence, linkedId: contact.id } });
        });
    }
    updateContact(updatedData) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.Contact.save(updatedData);
        });
    }
}
exports.default = new ContactService(repository_1.contactRepo);
