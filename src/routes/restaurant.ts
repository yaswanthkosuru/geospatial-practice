import express from "express";
const router = express.Router();
import { getRestaurants } from "../controllers/restaurant";

router.get("/v1/restaurants", getRestaurants);

export default router;
