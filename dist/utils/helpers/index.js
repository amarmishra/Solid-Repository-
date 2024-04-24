"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.secondaryContactLinkedIdsMatchPrimaryId = exports.updateContactTrailWithLinkPrcedence = exports.isPresentInContactTrail = exports.formatResponse = void 0;
function formatResponse(contactTrail) {
    const accumulatorResponse = contactTrail.reduce((acc, contact) => {
        var _a, _b, _c, _d;
        if (acc !== undefined) {
            if (contact.linkPrecedence === 'primary') {
                acc.primaryContatctId = contact.id;
            }
            if (contact.linkPrecedence === 'secondary') {
                acc.secondaryContactIds.push(contact.id);
            }
            if (contact.email && !((_a = acc.emails) === null || _a === void 0 ? void 0 : _a.includes(contact.email))) {
                (_b = acc.emails) === null || _b === void 0 ? void 0 : _b.push(contact.email);
            }
            if (contact.phoneNumber && !((_c = acc.phoneNumbers) === null || _c === void 0 ? void 0 : _c.includes(contact.phoneNumber))) {
                (_d = acc.phoneNumbers) === null || _d === void 0 ? void 0 : _d.push(contact.phoneNumber);
            }
        }
        return acc;
    }, { primaryContatctId: null, emails: [], phoneNumbers: [], secondaryContactIds: [] });
    return { contact: Object.assign({}, accumulatorResponse) };
}
exports.formatResponse = formatResponse;
function isPresentInContactTrail(val, arr) {
    return (arr.some(function (arrVal) {
        return (val.email === arrVal.email) || (val.phoneNumber == arrVal.phoneNumber);
    }));
}
exports.isPresentInContactTrail = isPresentInContactTrail;
function updateContactTrailWithLinkPrcedence(arr, val) {
    return arr.map((arrVal) => {
        if (arrVal.id === val.id) {
            return Object.assign(Object.assign({}, arrVal), { linkPrecedence: val.linkPrecedence });
        }
        return arrVal;
    });
}
exports.updateContactTrailWithLinkPrcedence = updateContactTrailWithLinkPrcedence;
function secondaryContactLinkedIdsMatchPrimaryId(secondaryContacts, primaryContacts) {
    return secondaryContacts[0].linkedId === primaryContacts[0].id;
}
exports.secondaryContactLinkedIdsMatchPrimaryId = secondaryContactLinkedIdsMatchPrimaryId;
