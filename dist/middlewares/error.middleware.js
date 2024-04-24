"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const exceptions_1 = __importDefault(require("../utils/exceptions"));
function ErrorHandler(err, req, res, next) {
    if (err instanceof exceptions_1.default) {
        return res.status(err.status).json({ message: err.message });
    }
    console.log(err);
    return res.status(500).json('Something went wrong');
}
exports.default = ErrorHandler;
