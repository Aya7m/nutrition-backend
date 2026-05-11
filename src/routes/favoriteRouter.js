import { Router } from "express";
import { getFavoriteMeals, toggleFavorite } from "../controllers/favorite.controller.js";
import { protectRouter } from "../middleware/protectRoute.js";

const favoriteRouter=Router()
favoriteRouter.post('/',protectRouter,toggleFavorite)
favoriteRouter.get('/',protectRouter,getFavoriteMeals)
export default favoriteRouter