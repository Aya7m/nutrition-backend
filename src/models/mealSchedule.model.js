import mongoose from "mongoose";

const mealScheduleSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    breakfast: {
      type: String,
      default: "08:00",
    },

    lunch: {
      type: String,
      default: "14:00",
    },

    dinner: {
      type: String,
      default: "20:00",
    },
  },
  { timestamps: true }
);

export const MealSchedule = mongoose.model(
  "MealSchedule",
  mealScheduleSchema
);