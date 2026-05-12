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

    const page = Math.max(Number(req.query.page) || 1, 1);

    const limit = Math.max(Number(req.query.limit) || 10, 1);

    let filter = {};

    // filter by type
    if (type) {
      filter.type = type;
    }

    // search
    if (search) {
      filter.$or = [
        {
          name: {
            $regex: search.trim(),
            $options: "i",
          },
        },
        {
          type: {
            $regex: search.trim(),
            $options: "i",
          },
        },
      ];
    }

    const skip = (page - 1) * limit;

    const [meals, total] = await Promise.all([
      Meal.find(filter)
        .select("-__v")
        .sort({ createdAt: -1 })
        .lean()
        .skip(skip)
        .limit(limit),

      Meal.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      total,
      page,
      pages: Math.ceil(total / limit),
      results: meals.length,
      meals,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
