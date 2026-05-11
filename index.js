import express from "express";
import http from "http";
import { Server } from "socket.io";
import { configDotenv } from "dotenv";
import cors from "cors"; // 👈 مهم

import { connect_db } from "./src/config/db.js";
import authRouter from "./src/routes/authRouter.js";
import mealRouter from "./src/routes/mealRouter.js";
import favoriteRouter from "./src/routes/favoriteRouter.js";
import dailyRouter from "./src/routes/dailyRouter.js";
import waterRouter from "./src/routes/waterRouter.js";
import scheduleRouter from "./src/routes/scheduleRouter.js";
import { startMealNotifier } from "./src/services/cron.js";
import mealSchedule from "./src/routes/scheduleRouter.js";
import activityRouter from "./src/routes/activityRouter.js";

configDotenv();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

export { io };

const port = process.env.PORT;

// ✅ هنا الحل
app.use(cors({
  origin: "http://localhost:5173",
}));

app.use(express.json());

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("joinRoom", (userId) => {
    socket.join(userId);
    console.log(`User joined room ${userId}`);
  });
});

connect_db();

app.use("/api/user", authRouter);
app.use("/api/meal", mealRouter);
app.use("/api/favorite", favoriteRouter);
app.use("/api/dailyMeal", dailyRouter);
app.use("/api/water", waterRouter);
app.use("/api/schedule", mealSchedule);
app.use("/api/activity", activityRouter);

// startMealNotifier();

app.get("/", (req, res) => res.send("Hello World!"));

server.listen(port, () => console.log(`Server running on port ${port}`));