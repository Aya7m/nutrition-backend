import mongoose from "mongoose";
const waterLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: String, // "YYYY-MM-DD"
      required: true,
    },
    amount: {
      type: Number, // بالملي (ml)
      default: 0,
    },
  },
  { timestamps: true },
);

export const Water=mongoose.model("Water",waterLogSchema)