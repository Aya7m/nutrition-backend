import { Router } from "express";
import upload from "../middleware/upload.js";
import { createMeal, getMeals } from "../controllers/meal.controller.js";
import { isAdmin, protectRouter } from "../middleware/protectRoute.js";

const mealRouter=Router()
mealRouter.post('/create',protectRouter,isAdmin,upload.single("image"),createMeal)
mealRouter.get('/',getMeals)

export default mealRouter