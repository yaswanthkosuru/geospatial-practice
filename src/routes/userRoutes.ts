import express from "express";
const router = express.Router();
import { registerUser, loginUser } from "../controllers/userControllers";

router.post("/v1/user/register", registerUser);
router.post("/v1/user/login", loginUser);

export default router;
