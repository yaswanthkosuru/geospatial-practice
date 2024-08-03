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
exports.closeConnection = exports.getDb = exports.connectToDatabase = void 0;
const mongodb_1 = require("mongodb");
const configCheck_1 = require("../configCheck");
if (!(0, configCheck_1.areEnvVariablesAvailable)("MONGO_URI", "MONGO_DB_NAME", "JWT_SECRET_KEY")) {
    process.exit(1);
}
const url = process.env.MONGO_URI;
const dbName = process.env.MONGO_DB_NAME;
const client = new mongodb_1.MongoClient(url, {});
let db;
const connectToDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield client.connect();
        console.log("Connected successfully to MongoDB");
        db = client.db(dbName);
        return db;
    }
    catch (err) {
        console.error(err);
        process.exit(1);
    }
});
exports.connectToDatabase = connectToDatabase;
const getDb = () => __awaiter(void 0, void 0, void 0, function* () {
    if (!db) {
        db = yield (0, exports.connectToDatabase)();
    }
    return db;
});
exports.getDb = getDb;
const closeConnection = () => __awaiter(void 0, void 0, void 0, function* () {
    yield client.close();
});
exports.closeConnection = closeConnection;
