"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const restaurantControllers_1 = require("../controllers/restaurantControllers");
const userAuth_1 = require("../middlewares/userAuth");
//get all restaurants
router.get('/v1/restaurants', userAuth_1.authenticateToken, restaurantControllers_1.getRestaurants);
//create restaurant
router.post('/v1/restaurant', userAuth_1.authenticateToken, restaurantControllers_1.getRestaurants);
//retrive restaurant
router.post('/v1/restaurant/:id', userAuth_1.authenticateToken, restaurantControllers_1.getRestaurants);
//update restaurant
router.put('/v1/restaurant/:id', userAuth_1.authenticateToken, restaurantControllers_1.getRestaurants);
//delete restaurant
router.delete('/v1/restaurant/:id', userAuth_1.authenticateToken, restaurantControllers_1.deleteRestaurant);
exports.default = router;
