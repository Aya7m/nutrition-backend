import { MealSchedule } from "../models/mealSchedule.model.js";


// save schedule
export const setMealSchedule = async (req, res) => {
  try {
    const userId = req.user._id;

    const { breakfast, lunch, dinner } = req.body;

    let schedule = await MealSchedule.findOne({ userId });

    if (!schedule) {
      schedule = await MealSchedule.create({
        userId,
        breakfast,
        lunch,
        dinner,
      });
    } else {
      schedule.breakfast = breakfast;
      schedule.lunch = lunch;
      schedule.dinner = dinner;

      await schedule.save();
    }

    res.json({
      success: true,
      message: "Schedule saved",
      schedule,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// get schedule
export const getMealSchedule = async (req, res) => {
  try {
    const userId = req.user._id;

    let schedule = await MealSchedule.findOne({ userId });

    if (!schedule) {
      schedule = await MealSchedule.create({
        userId,
      });
    }

    res.json({
      success: true,
      schedule,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};