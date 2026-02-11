import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

const isAuthenticated = async (req, res, next) => {
  try {
    let token;

    // From cookies
    if (req.cookies?.token) {
      token = req.cookies.token;
    }

    // From Authorization header
    if (!token && req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        message: "User not authenticated",
        success: false,
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        message: "User not found",
        success: false,
      });
    }

    req.user = user; // ✅ FULL USER OBJECT
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
      success: false,
    });
  }
};

export default isAuthenticated;


/*import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
  try {
    let token;

    // From cookies
    if (req.cookies?.token) {
      token = req.cookies.token;
    }

    // From Authorization header
    if (!token && req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        message: "User not authenticated",
        success: false,
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ STANDARDIZED USER OBJECT
    req.user = {
      _id: decoded.id,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
      success: false,
    });
  }
};

export default isAuthenticated; */
