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
exports.getRestaurants = getRestaurants;
exports.deleteRestaurant = deleteRestaurant;
const connectionTomongo_1 = require("../utils/database/connectionTomongo");
const mongodb_1 = require("mongodb");
function getRestaurants(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const db = yield (0, connectionTomongo_1.getDb)();
            console.log(req.user, 'req.user inside get restaurent');
            const restaurantCollection = db.collection('restaurants');
            const documents = yield restaurantCollection.find({}).limit(10).toArray();
            res.json(documents);
        }
        catch (err) {
            console.error('Failed to execute query', err);
            res.status(500).send('Error executing query');
        }
    });
}
function deleteRestaurant(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const db = yield (0, connectionTomongo_1.getDb)();
            const id = req.params.id;
            console.log(req.user, id, 'req.user inside get restaurent');
            const restaurantCollection = db.collection('restaurants');
            if (!mongodb_1.ObjectId.isValid(id)) {
                return res.status(400).json({ message: 'Invalid restaurant ID' });
            }
            const document = yield restaurantCollection.findOneAndDelete({
                _id: new mongodb_1.ObjectId(req.params.id),
            });
            if (!document) {
                return res.status(404).json({ message: 'Restaurant not found' });
            }
            res.json({
                message: 'deleted succesfully',
                document,
            });
        }
        catch (err) {
            console.error('Failed to execute query', err);
            res.status(500).send('Error executing query');
        }
    });
}
