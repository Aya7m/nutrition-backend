import { Router } from "express";
import { getProfile, login, signUp, updateProfile } from "../controllers/auth.controller.js";
import { protectRouter } from "../middleware/protectRoute.js";

const authRouter = Router();
authRouter.post("/register", signUp);
authRouter.post("/login", login);
authRouter.get("/profile", protectRouter, getProfile);
authRouter.put('/update-profile', protectRouter, updateProfile);
export default authRouter;
