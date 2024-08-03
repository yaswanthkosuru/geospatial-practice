"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const userSchema = zod_1.z.object({
    username: zod_1.z
        .string()
        .min(1, "Username is required")
        .max(30, "Username must be less than 30 characters"),
    password: zod_1.z.string().min(6, "Password must be at least 6 characters long"),
});
exports.default = userSchema;
