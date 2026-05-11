import cron from "node-cron";
import { MealSchedule } from "../models/mealSchedule.model.js";
import { io } from "../../index.js";

let isRunning = false;

export const startMealNotifier = () => {
  cron.schedule("* * * * *", async () => {
    if (isRunning) return; // 🚨 prevent overlap

    isRunning = true;

    try {
      const currentTime = new Date()
        .toTimeString()
        .slice(0, 5);

      const schedules = await MealSchedule.find({
        $or: [
          { breakfast: currentTime },
          { lunch: currentTime },
          { dinner: currentTime },
        ],
      });

      for (const s of schedules) {
        const userId = s.userId.toString();

        if (s.breakfast === currentTime) {
          io.to(userId).emit("mealReminder", {
            message: "🍳 Breakfast time!",
          });
        }

        if (s.lunch === currentTime) {
          io.to(userId).emit("mealReminder", {
            message: "🍗 Lunch time!",
          });
        }

        if (s.dinner === currentTime) {
          io.to(userId).emit("mealReminder", {
            message: "🍽️ Dinner time!",
          });
        }
      }
    } catch (error) {
      console.error("Meal notifier error:", error);
    } finally {
      isRunning = false;
    }
  });
};