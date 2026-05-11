
import { Activity } from "../models/active.model.js";
import { getToday } from "../services/date.js";

const caloriesMap = {
  running: 10,
  walking: 4,
  swimming: 8,
};

export const addActivity = async (req, res) => {
  try {
    const userId = req.user._id;
    const { type, duration } = req.body;

    const calories = (caloriesMap[type] || 5) * duration;

    const activity = await Activity.create({
      userId,
      type,
      duration,
      caloriesBurned: calories,
      date: getToday(),
    });

    res.json({ success: true, activity });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getTodayActivities = async (req, res) => {
  try {
    const userId = req.user._id;

    const activities = await Activity.find({
      userId,
      date: getToday(),
    });

    const totalBurned = activities.reduce(
      (acc, a) => acc + a.caloriesBurned,
      0
    );

    res.json({ activities, totalBurned });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};