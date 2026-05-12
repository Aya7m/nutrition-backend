import { Activity } from "../models/active.model.js";
import { DailyLog } from "../models/dailyLog.model.js";
import { Meal } from "../models/meal.model.js";
import { getToday } from "../services/date.js";

export const addMeal = async (req, res) => {
  try {
    const userId = req.user._id;
    const { mealId, quantity } = req.body;

    const meal = await Meal.findById(mealId);
    if (!meal) return res.status(404).json({ message: "Meal not found" });

    const qty = Number(quantity) || 1;
    const calories = meal.calories * qty;

    const today = getToday();

    let log = await DailyLog.findOne({ userId, date: today });

    if (!log) {
      log = await DailyLog.create({
        userId,
        date: today,
        meals: [],
        totalCalories: 0,
      });
    }

    log.meals.push({
      mealId,
      quantity: qty,
      calories,
    });

    log.totalCalories += calories;

    await log.save();

    return res.json({
      success: true,
      message: "Meal added successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getDailyLog = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const today = getToday();

    const log = await DailyLog.findOne({
      userId: user._id,
      date: today,
    }).populate({
      path: "meals.mealId",
      select: "name calories protein carbs fat image type",
    });

    const goal =
      user.goal === "lose" ? 1800 : user.goal === "gain" ? 2800 : 2200;

    const totalCalories = log?.totalCalories || 0;

    const remaining = goal - totalCalories;

    const progress = Math.min(Math.round((totalCalories / goal) * 100), 100);

    return res.json({
      date: today,
      meals: log?.meals || [],
      totalCalories,
      goal,
      remaining,
      progress,
      status:
        progress < 50
          ? "Keep going 💪"
          : progress < 100
            ? "Almost there 🔥"
            : "Goal achieved 🎉",
    });
  } catch (error) {
    console.log("DAILY LOG ERROR:", error); // 👈 مهم جدًا
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const getWeeklyStats = async (req, res) => {
  try {
    const user = req.user;

    const today = new Date();
    let days = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      days.push(d.toISOString().split("T")[0]);
    }

    const logs = await DailyLog.find({
      userId: user._id,
      date: { $in: days },
    }).lean();

    const map = {};
    logs.forEach((log) => {
      map[log.date] = log.totalCalories;
    });

    const result = days.map((date) => ({
      date,
      calories: map[date] || 0,
    }));

    return res.json({ data: result });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// recommend meals based on user goal and history
export const getRecommendedMeals = async (req, res) => {
  try {
    const user = req.user;
    const today = getToday();

    const log = await DailyLog.findOne({
      userId: user._id,
      date: today,
    });

    const consumedCalories = log?.totalCalories || 0;

    const goalCalories =
      user.goal === "lose" ? 1800 : user.goal === "gain" ? 2800 : 2200;

    const remainingCalories = Math.max(goalCalories - consumedCalories, 0);

    const eatenMealIds = log?.meals?.map((m) => m.mealId?.toString()) || [];

    // 🔥 MAIN QUERY (SMART FILTER)
    let meals = await Meal.find({
      _id: { $nin: eatenMealIds },
      calories: {
        $lte: goalCalories * 0.6, // مش high calorie meals
      },
    })
      .select("name calories protein carbs fat image type")
      .lean();

    // 🔥 SCORING SYSTEM (INTELLIGENCE)
    meals = meals.map((meal) => {
      let score = 0;

      // قريب من remaining calories
      score -= Math.abs(meal.calories - remainingCalories);

      // بروتين أعلى = أفضل
      score += meal.protein * 3;

      // تقليل الدهون لو هدف خسارة
      if (user.goal === "lose") {
        score -= meal.fat * 2;
      }

      return {
        ...meal,
        score,
      };
    });

    // ترتيب حسب الأفضل
    meals.sort((a, b) => b.score - a.score);

    const recommendedMeals = meals.slice(0, 6);

    // 🔥 fallback لو فاضي
    if (!recommendedMeals.length) {
      const fallback = await Meal.find({})
        .select("name calories protein carbs fat image type")
        .limit(6)
        .lean();

      return res.json({
        success: true,
        remainingCalories,
        recommendations: fallback,
      });
    }

    return res.json({
      success: true,
      remainingCalories,
      recommendations: recommendedMeals,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
