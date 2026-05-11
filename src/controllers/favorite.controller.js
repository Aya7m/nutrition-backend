import { FavoriteMeal } from "../models/favorite.model.js";

// add and remove favorite meal
export const toggleFavorite = async (req, res) => {
  try {
    const userId = req.user._id;
    const { mealId } = req.body;
    const existing = await FavoriteMeal.findOne({ userId, mealId });
    if (existing) {
      await existing.deleteOne();
      return res.json({ message: "Removed from favorites" });
    }
    const favorite = await FavoriteMeal.create({ userId, mealId });
    res.json({ message: "Add To Favorite", favorite });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get all favorite meals
export const getFavoriteMeals = async (req, res) => {
  try {
    const userId = req.user._id;
    const favorites = await FavoriteMeal.find({ userId }).populate("mealId");
    res.json({ favorites });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
