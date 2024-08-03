import express from "express";
const router = express.Router();
import { registerUser, loginUser } from "../controllers/userControllers";

router.post("/v1/register", registerUser);
router.post("/v1/login", loginUser);

export default router;
