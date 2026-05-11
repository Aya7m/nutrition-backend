import { Router } from "express";
import { protectRouter } from "../middleware/protectRoute.js";
import{setMealSchedule,getMealSchedule} from '../controllers/mealSchedule.controller.js'

const mealSchedule=Router()
mealSchedule.post("/", protectRouter, setMealSchedule);

mealSchedule.get("/", protectRouter, getMealSchedule);

export default mealSchedule