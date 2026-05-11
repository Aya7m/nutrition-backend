import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
export const protectRouter = async (req, res, next) => {
  try {
    let token;

    // check if token exist or no
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // 2. لو مفيش token
    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }
    // verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // get user from db
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // 5. نحطه في req
    // req.user = user;
    req.user = {
      _id: user._id,
      email: user.email,
      role: user.role,
      goal: user.goal,
    };
    next();
  } catch (error) {
    return res.status(401).json({ message: "Not authorized" });
  }
};

export const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin only" });
  }
  next();
};
