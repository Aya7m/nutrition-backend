import { Router } from "express";
import { protectRouter } from "../middleware/protectRoute.js";
import { addActivity, getTodayActivities } from "../controllers/active.controller.js";

const activityRouter=Router()
activityRouter.post('/',protectRouter,addActivity)
activityRouter.get('/active-day',protectRouter,getTodayActivities)

export default activityRouter