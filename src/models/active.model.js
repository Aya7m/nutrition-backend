import mongoose from "mongoose";

const activitySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  type: {
    type: String, // running, walking, swimming
  },

  duration: Number, // بالدقايق

  caloriesBurned: Number,

  date: String,
});

export const Activity = mongoose.model("Activity", activitySchema);