import mongoose from "mongoose";
const userModel = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    age: { type: Number },
    weight: { type: Number },
    height: { type: Number },
    goal: {
      type: String,
      enum: ["lose", "gain", "maintain"],

      default: "maintain",
    },
    activityLevel: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },

    dailyCalories: {
      type: Number,
      default: 0,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  { timestamps: true },
);

export const User = mongoose.model("User", userModel);
