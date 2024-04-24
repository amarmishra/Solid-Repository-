"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const app_1 = __importDefault(require("./app"));
const indentity_1 = __importDefault(require("./controllers/indentity"));
const app = new app_1.default(3000, [new indentity_1.default()]);
app.listen();
