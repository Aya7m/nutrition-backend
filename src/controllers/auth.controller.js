import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

// BMI
const calculateBMI = (weight, height) => {
  const heightInMeters = height / 100;
  return weight / (heightInMeters * heightInMeters);
};

// تحديد الهدف تلقائيًا
const getGoalFromBMI = (bmi) => {
  if (bmi < 18.5) return "gain";
  if (bmi < 25) return "maintain";
  return "lose";
};
export const signUp = async (req, res) => {
  try {
    const { name, email, password, age, weight, height, activityLevel, goal } =
      req.body;
    if (!email || !name || !password || !age || !weight || !height) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // check if email is register before or not
    const emailExist = await User.findOne({ email });
    if (emailExist) {
      return res.status(400).json({ message: "User already exists" });
    }

    // hash password
    const hashPassword = await bcrypt.hash(password, 10);

    // حساب BMI + goal
    const bmi = calculateBMI(weight, height);
    const autoGoal = getGoalFromBMI(bmi);
    // لو المستخدم مااختارش goal
    const finalGoal = goal && goal !== "" ? goal : autoGoal;

    const finalActivityLevel = activityLevel || "medium";
    // create user
    const user = await User.create({
      name,
      email,
      password: hashPassword,
      age,
      weight,
      height,
      activityLevel: finalActivityLevel,
      goal: finalGoal,
    });

    // generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(201).json({ message: "User created successfully", user, token });
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: error.message });
  }
};

// login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    const { password: _, ...safeUser } = user._doc;

    res.status(200).json({
      message: "User login successfully",
      user: safeUser,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// getProfile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
