import express from 'express';
const router = express.Router();
import { getRestaurants, deleteRestaurant } from '../controllers/restaurantControllers';
import { authenticateToken } from '../middlewares/userAuth';
//get all restaurants
router.get('/v1/restaurants', authenticateToken, getRestaurants);
//create restaurant
router.post('/v1/restaurant', authenticateToken, getRestaurants);
//retrive restaurant
router.post('/v1/restaurant/:id', authenticateToken, getRestaurants);
//update restaurant
router.put('/v1/restaurant/:id', authenticateToken, getRestaurants);
//delete restaurant
router.delete('/v1/restaurant/:id', authenticateToken, deleteRestaurant);

export default router;
