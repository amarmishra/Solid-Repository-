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
exports.connectDb = exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const path_1 = __importDefault(require("path"));
exports.AppDataSource = new typeorm_1.DataSource({
    type: "postgres",
    host: "dpg-coko4egl5elc73ddjsv0-a",
    port: 5432,
    username: 'amarmishra',
    password: "SDZd6eEuTWIHXAc7ebwdJk36nIXOyhl6",
    database: "bitespeed_db_0xim",
    entities: [path_1.default.join(__dirname, './models/*.{ts,js}')],
    logging: true,
    synchronize: true
});
function connectDb() {
    return __awaiter(this, void 0, void 0, function* () {
        exports.AppDataSource.initialize();
    });
}
exports.connectDb = connectDb;
