import { Router } from "express";
import { getProfile, login, signUp } from "../controllers/auth.controller.js";
import { protectRouter } from "../middleware/protectRoute.js";

const authRouter = Router();
authRouter.post("/register", signUp);
authRouter.post("/login", login);
authRouter.get("/profile", protectRouter, getProfile);
export default authRouter;
