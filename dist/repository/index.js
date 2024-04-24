"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.contactRepo = void 0;
const connect_db_1 = require("../connect-db");
const contact_1 = __importDefault(require("../models/contact"));
exports.contactRepo = connect_db_1.AppDataSource.getRepository(contact_1.default);
