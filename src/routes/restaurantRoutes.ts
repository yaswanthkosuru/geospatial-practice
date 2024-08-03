import express from "express";
const router = express.Router();
import { getRestaurants } from "../controllers/restaurantControllers";

router.get("/v1/restaurants", getRestaurants);

export default router;
