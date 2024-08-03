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
exports.registerUser = registerUser;
exports.loginUser = loginUser;
const connectionTomongo_1 = require("../utils/database/connectionTomongo");
const userModel_1 = __importDefault(require("../models/userModel"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const zod_1 = require("zod");
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
function registerUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const db = yield (0, connectionTomongo_1.getDb)();
            const usersCollection = db.collection('users');
            const parsed = userModel_1.default.parse(req.body);
            const hashedPassword = yield bcrypt_1.default.hash(parsed.password, 10);
            const user = yield usersCollection.findOne({ username: parsed.username });
            if (user) {
                return res.status(400).json({ errors: `User ${user.username} already exists` });
            }
            yield usersCollection.insertOne({
                username: parsed.username,
                password: hashedPassword,
            });
            res.status(201).send('User registered');
        }
        catch (err) {
            if (err instanceof zod_1.z.ZodError) {
                const errorMessages = err.errors.map((error) => ({
                    path: error.path.join('.'),
                    message: error.message,
                }));
                return res.status(400).json({ errors: errorMessages });
            }
            res.status(500).send('unknown error occured');
        }
    });
}
function loginUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const parsed = userModel_1.default.parse(req.body);
            const db = yield (0, connectionTomongo_1.getDb)();
            const usersCollection = db.collection('users');
            const { username, password } = parsed;
            const user = yield usersCollection.findOne({ username });
            if (!user || !(yield bcrypt_1.default.compare(password, user.password))) {
                return res.status(401).send('Invalid credentials');
            }
            const token = jsonwebtoken_1.default.sign(user, JWT_SECRET_KEY, {
                expiresIn: '1h',
            });
            res.json({ token });
        }
        catch (err) {
            console.error(err);
            res.status(500).send('Error please provide valid credentials');
        }
    });
}
