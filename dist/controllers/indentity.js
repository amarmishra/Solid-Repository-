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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const contact_service_1 = __importDefault(require("../services/contact.service"));
const exceptions_1 = __importDefault(require("../utils/exceptions"));
const helpers_1 = require("../utils/helpers");
class IdentityController {
    constructor() {
        this.path = '/identity';
        this.router = (0, express_1.Router)();
        this.intializeRoutes();
    }
    intializeRoutes() {
        this.router.post(this.path, this.identityController);
    }
    identityController(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { email, phoneNumber, cleanEmail = email || null, cleanPhone = phoneNumber || null } = req.body;
                if (!email && !phoneNumber) {
                    throw new exceptions_1.default(400, 'Bad Request. Cannot proceed with identification');
                }
                let contactTrail = yield contact_service_1.default.findContactWithEmailOrPhoneNumber({ email: cleanEmail, phoneNumber: cleanPhone });
                //Case:no contat exits,create a primary contact
                if (contactTrail.length === 0) {
                    const contact = yield contact_service_1.default.createContact({ email: cleanEmail, phoneNumber: cleanPhone, linkPrecedence: 'primary' });
                    contactTrail.push(contact);
                    const formattedResponse = (0, helpers_1.formatResponse)(contactTrail);
                    return res.status(200).json(Object.assign({}, formattedResponse));
                }
                let primaryContacts = contactTrail.filter((contact) => { return contact.linkPrecedence === 'primary'; });
                //Case : contactTrail has more than one primary contacts 
                if (primaryContacts.length > 1) {
                    const primaryContactIds = primaryContacts.map((contact) => { return contact.id; });
                    const updatedContact = yield contact_service_1.default.updateContact({ id: primaryContactIds[1], linkedId: primaryContactIds[0], linkPrecedence: 'secondary' });
                    contactTrail = (0, helpers_1.updateContactTrailWithLinkPrcedence)(contactTrail, updatedContact);
                    return res.status(200).json((0, helpers_1.formatResponse)(contactTrail));
                }
                let secondaryContacts = contactTrail.filter((contact) => { return contact.linkPrecedence === 'secondary'; });
                if (primaryContacts.length === 0 && secondaryContacts.length !== 0) {
                    //fetch primary contact for secondaryContact linkedId
                    const { linkedId } = secondaryContacts[0];
                    primaryContacts = yield contact_service_1.default.findPrimaryContactFromSecondaryLinkedId({ linkedId, linkPrecedence: 'primary' });
                }
                /*Special case:
                    Only one primary and secondary contacts are available
                    But primary id does not match secondary contacts linkId
                */
                else if (primaryContacts.length !== 0 && secondaryContacts.length !== 0 && !(0, helpers_1.secondaryContactLinkedIdsMatchPrimaryId)(secondaryContacts, primaryContacts)) {
                    const primaryContactId = primaryContacts.map((contact) => { return contact.id; })[0];
                    const unmatchedSecondaryContacts = secondaryContacts.filter((secondaryContact) => {
                        return secondaryContact.linkedId !== primaryContactId;
                    });
                    const unmatchedSecondaryContactsLinkedId = unmatchedSecondaryContacts[0].linkedId;
                    if (primaryContactId > unmatchedSecondaryContactsLinkedId) {
                        //update primary contact to secondary contact with linkedId = unmatchedSecondaryContactsLinkedId
                        yield contact_service_1.default.updateContact({ id: primaryContactId, linkedId: unmatchedSecondaryContactsLinkedId, linkPrecedence: 'secondary' });
                    }
                    //upadate secondary contacts linkedId with primaryId + updated contact with id = unmatchedSecondaryContactsLinkedId as secondary(with linkId= primaryId)
                    yield Promise.all([...(unmatchedSecondaryContacts.map((contact) => { return contact_service_1.default.updateContact({ id: contact.id, linkedId: primaryContactId }); })), contact_service_1.default.updateContact({ id: unmatchedSecondaryContactsLinkedId, linkedId: primaryContactId, linkPrecedence: 'secondary' })]);
                }
                //get Secondary Contacts where linkedId is primary 
                const secondaryContactsFromPrimary = yield contact_service_1.default.findSecondaryContactsFromPrimaryId({ id: (_a = primaryContacts[0]) === null || _a === void 0 ? void 0 : _a.id, linkPrecedence: 'secondary' });
                contactTrail = primaryContacts.concat(secondaryContactsFromPrimary);
                //Case: contactTrail has one primary contact and contactTrail does not have same value as requested
                if (!(0, helpers_1.isPresentInContactTrail)({ email: cleanEmail, phoneNumber: cleanPhone }, contactTrail)) {
                    //get Primary Contacts Ids
                    const primaryContactIds = contactTrail.filter((contact) => { return contact.linkPrecedence === 'primary'; }).map((contact) => { return contact.id; });
                    const contact = yield contact_service_1.default.createContact({ email, phoneNumber, linkPrecedence: 'secondary', linkedId: primaryContactIds[0] });
                    contactTrail.push(contact);
                    return res.status(200).json((0, helpers_1.formatResponse)(contactTrail));
                }
                return res.status(200).json((0, helpers_1.formatResponse)(contactTrail));
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.default = IdentityController;
