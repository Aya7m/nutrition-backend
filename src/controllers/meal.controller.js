import { Meal } from "../models/meal.model.js";

// create meal
export const createMeal = async (req, res) => {
  try {
    const { name, calories, protein, carbs, fat, type } = req.body;

    // الصورة جاية من multer + cloudinary
    const image = req.file?.path;
    if (!name || !calories || !type || !image) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const meal = await Meal.create({
      name,
      calories,
      protein,
      carbs,
      fat,
      type,
      image,
    });
    res.status(201).json({
      message: "Meal created successfully",
      meal,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// get all meals
export const getMeals = async (req, res) => {
  try {
    const { type, search } = req.query;

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    let filter = {};

    // filter by type
    if (type) {
      filter.type = type;
    }

    // search by name
    if (search) {
      filter.name = {
        $regex: search,
        $options: "i",
      };
    }

    const skip = (page - 1) * limit;

    const meals = await Meal.find(filter)
      .select("-__v")
      .lean()
      .skip(skip)
      .limit(limit);

    const total = await Meal.countDocuments(filter);

    res.status(200).json({
      meals,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
