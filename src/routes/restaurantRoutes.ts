import express from 'express';
const router = express.Router();
import {
	createRestaurant,
	getRestaurant,
	getRestaurantsInRadiusRange,
	getRestaurantsInDistanceRange,
	updateRestaurant,
	deleteRestaurant,
} from '../controllers/restaurantControllers';
import { authenticateToken } from '../middlewares/userAuth';
//create restaurant
router.post('/v1/restaurant', authenticateToken, createRestaurant);

//get restaurant by id
router.get('/v1/restaurant/:id', authenticateToken, getRestaurant);
//get  restaurants in radius range
router.get('/v1/restaurantsinrange', authenticateToken, getRestaurantsInRadiusRange);
//get  restaurants in distance range
router.get('/v1/restaurantsindistancerange', authenticateToken, getRestaurantsInDistanceRange);

//update restaurant
router.put('/v1/restaurant/:id', authenticateToken, updateRestaurant);

//delete restaurant
router.delete('/v1/restaurant/:id', authenticateToken, deleteRestaurant);

export default router;
