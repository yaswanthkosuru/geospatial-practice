import express from 'express';
const router = express.Router();
import { getRestaurants } from '../controllers/restaurantControllers';
import { authenticateToken } from '../middlewares/userAuth';

router.get('/v1/restaurants', authenticateToken, getRestaurants);

export default router;
