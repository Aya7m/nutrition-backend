import { Water } from "../models/waterLog.model.js";

let WATER_GOAL=200;
// add water
export const addWater = async (req, res) => {
  try {
    const userId = req.user._id;
    const { amount = 250 } = req.body;

    const today = new Date().toISOString().split("T")[0];

    let log = await Water.findOne({ userId, date: today });

    if (!log) {
      log = await Water.create({
        userId,
        amount: 0,
        date: today,
      });
    }

    log.amount += Number(amount);
    await log.save();

    res.json({
      message: "Water added",
      amount: log.amount,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get water

export const getWater = async (req, res) => {
  try {
    const userId = req.user._id;

    const today = new Date().toISOString().split("T")[0];

    const log = await Water.findOne({ userId, date: today });

    const amount = log?.amount || 0;

    const goal = WATER_GOAL;

    const remaining = goal - amount;

    const progress = Math.min(
      Math.round((amount / goal) * 100),
      100
    );

    res.json({
      amount,
      goal,
      remaining,
      progress,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};