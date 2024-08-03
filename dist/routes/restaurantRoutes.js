"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const restaurantControllers_1 = require("../controllers/restaurantControllers");
const userAuth_1 = require("../middlewares/userAuth");
//create restaurant
router.post('/v1/restaurant', userAuth_1.authenticateToken, restaurantControllers_1.createRestaurant);
//get restaurant by id
router.get('/v1/restaurant/:id', userAuth_1.authenticateToken, restaurantControllers_1.getRestaurant);
//get  restaurants in radius range
router.get('/v1/restaurantsinrange', userAuth_1.authenticateToken, restaurantControllers_1.getRestaurantsInRadiusRange);
//get  restaurants in distance range
router.get('/v1/restaurantsindistancerange', userAuth_1.authenticateToken, restaurantControllers_1.getRestaurantsInDistanceRange);
//update restaurant
router.put('/v1/restaurant/:id', userAuth_1.authenticateToken, restaurantControllers_1.updateRestaurant);
//delete restaurant
router.delete('/v1/restaurant/:id', userAuth_1.authenticateToken, restaurantControllers_1.deleteRestaurant);
exports.default = router;
