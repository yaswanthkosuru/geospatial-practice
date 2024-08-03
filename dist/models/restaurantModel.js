"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const restaurantSchema = zod_1.z.object({
    location: zod_1.z.object({
        coordinates: zod_1.z.tuple([zod_1.z.number(), zod_1.z.number()]),
        type: zod_1.z.literal('Point'),
    }),
    name: zod_1.z.string(),
});
exports.default = restaurantSchema;
