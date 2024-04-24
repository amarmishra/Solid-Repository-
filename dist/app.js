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
const express_1 = __importDefault(require("express"));
const error_middleware_1 = __importDefault(require("./middlewares/error.middleware"));
const exceptions_1 = __importDefault(require("./utils/exceptions"));
const connect_db_1 = require("./connect-db");
class App {
    constructor(port, controllers) {
        this.port = port;
        this.databaseUp = true;
        this.app = (0, express_1.default)();
        this.setMiddleWares();
        this.intializeControllers(controllers);
        this.setErrorHandler();
    }
    connectDb() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield (0, connect_db_1.connectDb)();
                this.databaseUp = true;
                console.log('Database connected successfully');
            }
            catch (error) {
                throw new exceptions_1.default(500, 'Unable to connect to database');
            }
        });
    }
    setMiddleWares() {
        //this.app.use(cors());
        this.app.use(express_1.default.json());
    }
    intializeControllers(controllers) {
        controllers.forEach((controller) => {
            this.app.use(controller.router);
        });
    }
    setErrorHandler() {
        this.app.use(error_middleware_1.default);
    }
    listen() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.connectDb();
            if (this.databaseUp) {
                this.app.listen(this.port, () => {
                    console.log(`Application running at port ${this.port}`);
                });
                return;
            }
            throw new exceptions_1.default(500, 'Database not connected');
        });
    }
}
exports.default = App;
