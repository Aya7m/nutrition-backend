import { Router } from "express";
import { protectRouter } from "../middleware/protectRoute.js";
import { addMeal, getDailyLog, getRecommendedMeals, getWeeklyStats } from "../controllers/daily.controller.js";
import { getMeals } from "../controllers/meal.controller.js";

const dailyRouter=Router()
dailyRouter.post("/add", protectRouter, addMeal);
dailyRouter.get("/", protectRouter, getMeals);
dailyRouter.get("/today", protectRouter, getDailyLog);
dailyRouter.get("/weekly", protectRouter, getWeeklyStats);
dailyRouter.get("/recommend", protectRouter, getRecommendedMeals);
export default dailyRouter