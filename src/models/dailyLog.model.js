import mongoose from "mongoose";
const dailySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    meals: [
      {
        mealId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Meal",
        },
        quantity: {
          type: Number,
          default: 1,
        },
        calories: Number,
      },
    ],
    totalCalories: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);
export const DailyLog = mongoose.model("DailyLog", dailySchema);
