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
exports.createRestaurant = createRestaurant;
exports.getRestaurant = getRestaurant;
exports.getRestaurantsInRadiusRange = getRestaurantsInRadiusRange;
exports.getRestaurantsInDistanceRange = getRestaurantsInDistanceRange;
exports.updateRestaurant = updateRestaurant;
exports.deleteRestaurant = deleteRestaurant;
const connectionTomongo_1 = require("../utils/database/connectionTomongo");
const mongodb_1 = require("mongodb");
const restaurantModel_1 = __importDefault(require("../models/restaurantModel"));
function createRestaurant(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const db = yield (0, connectionTomongo_1.getDb)();
            const restaurantCollection = db.collection('restaurants');
            // Validate request body against the schema
            const validationResult = restaurantModel_1.default.safeParse(req.body);
            if (!validationResult.success) {
                return res
                    .status(400)
                    .json({ message: 'Invalid request data', errors: validationResult.error.errors });
            }
            const { location, name } = req.body;
            // Insert the new restaurant into the collection
            const result = yield restaurantCollection.insertOne({
                _id: new mongodb_1.ObjectId(), // MongoDB will handle the ID generation
                location,
                name,
            });
            res.status(201).json({
                message: 'Restaurant created successfully',
                document: result, // Return the newly created document
            });
        }
        catch (err) {
            console.error('Failed to execute query', err);
            res.status(500).send('Error executing query');
        }
    });
}
function getRestaurant(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const db = yield (0, connectionTomongo_1.getDb)();
            const { id } = req.params;
            const restaurantCollection = db.collection('restaurants');
            const restaurantDocument = yield restaurantCollection.findOne({ _id: new mongodb_1.ObjectId(id) });
            res.json(restaurantDocument);
        }
        catch (err) {
            console.error('Failed to execute query', err);
            res.status(500).send('Error executing query');
        }
    });
}
function getRestaurantsInRadiusRange(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const longitude = parseFloat(req.query.longitude);
            const latitude = parseFloat(req.query.latitude);
            const radius = parseFloat(req.query.radius);
            const db = yield (0, connectionTomongo_1.getDb)();
            const restaurantCollection = db.collection('restaurants');
            if (isNaN(longitude) ||
                isNaN(latitude) ||
                isNaN(radius) ||
                !isFinite(longitude) ||
                !isFinite(latitude) ||
                !isFinite(radius)) {
                console.error('Invalid parameters:', { longitude, latitude, radius });
                return res.status(400).send('Invalid parameters');
            }
            // Convert radius from meters to radians
            const radiusInRadians = radius / 6371000; // Earth radius in meters (6371000 meters)
            const nearRestaurantDocuments = yield restaurantCollection
                .find({
                location: {
                    $geoWithin: {
                        $centerSphere: [[longitude, latitude], radiusInRadians],
                    },
                },
            })
                .toArray();
            res.json(nearRestaurantDocuments);
        }
        catch (err) {
            console.error('Failed to execute query', err);
            res.status(500).send('Error executing query');
        }
    });
}
function getRestaurantsInDistanceRange(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const longitude = parseFloat(req.query.longitude);
            const latitude = parseFloat(req.query.latitude);
            const mindistance = parseFloat(req.query.mindistance);
            const maxdistance = parseFloat(req.query.maxdistance);
            const db = yield (0, connectionTomongo_1.getDb)();
            const restaurantCollection = db.collection('restaurants');
            if (isNaN(longitude) ||
                isNaN(latitude) ||
                isNaN(mindistance) ||
                isNaN(maxdistance) ||
                !isFinite(longitude) ||
                !isFinite(latitude) ||
                !isFinite(mindistance) ||
                !isFinite(maxdistance)) {
                console.error('Invalid parameters:', { longitude, latitude, mindistance, maxdistance });
                return res.status(400).send('Invalid parameters');
            }
            const nearRestaurantDocuments = yield restaurantCollection
                .find({
                location: {
                    $near: {
                        $geometry: {
                            type: 'Point',
                            coordinates: [longitude, latitude],
                        },
                        $maxDistance: maxdistance,
                        $minDistance: mindistance,
                    },
                },
            })
                .toArray();
            res.json(nearRestaurantDocuments);
        }
        catch (err) {
            console.error('Failed to execute query', err);
            res.status(500).send('Error executing query');
        }
    });
}
function updateRestaurant(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const db = yield (0, connectionTomongo_1.getDb)();
            const id = req.params.id;
            const restaurantCollection = db.collection('restaurants');
            if (!mongodb_1.ObjectId.isValid(id)) {
                return res.status(400).json({ message: 'Invalid restaurant ID' });
            }
            const document = yield restaurantCollection.findOne({ _id: new mongodb_1.ObjectId(id) });
            const { location, name } = req.body;
            if (!document) {
                return res.status(404).json({ message: 'Restaurant not found' });
            }
            const restaurantdocumentafter = yield restaurantCollection.findOneAndUpdate({ _id: new mongodb_1.ObjectId(id) }, {
                $set: Object.assign(Object.assign({}, (location && { location })), (name && { name })),
            }, { returnDocument: 'after' } // Return the document after update
            );
            res.json({
                message: 'deleted succesfully',
                restaurantdocumentafter,
            });
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
