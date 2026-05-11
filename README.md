# 🥗 Nutrition / Diet Tracking Backend API

## 📌 Overview
This is the backend API for a Diet & Nutrition Tracking App.  
It allows users to track meals, daily logs, calories, and monitor their health goals.

Built using Node.js, Express, and MongoDB.

---

## 🚀 Tech Stack
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- bcrypt
- dotenv

---

## 📁 Project Structure
backend/
├── models/
├── controllers/
├── routes/
├── middleware/
├── lib/
├── index.js

---

## ⚙️ Installation
npm install

---

## ▶️ Run Server
npm run dev

Server runs on:
http://localhost:5000

---

## 🔐 Environment Variables
PORT=5000
MONGO_URL=your_mongodb_url
JWT_SECRET=your_secret

---

## 🔑 Authentication
- Register user
- Login user
- Protected routes using JWT

---

## 🍽️ Main Features

👤 User:
- Register / Login
- Profile management
- Set health goals

🍱 Meals:
- Add meal
- Remove meal
- View daily meals

📊 Daily Logs:
- Track meals per day
- Calculate calories

---

## 📌 API Routes

Auth:
POST /api/user/register
POST /api/user/login

Meals:
POST /api/meal/add
GET /api/meal
DELETE /api/meal/:id

Daily Logs:
GET /api/dailyMeal/today
POST /api/dailyMeal/add

---

## ❗ Error Handling
{
  "message": "error message"
}

---

## 👩‍💻 Author
Aya