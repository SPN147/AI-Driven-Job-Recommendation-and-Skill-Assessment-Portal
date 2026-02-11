import { User } from "../models/user.model.js";
import { Company } from "../models/company.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import axios from "axios";
import FormData from "form-data";

/* =====================================================
   REGISTER USER
===================================================== */
export const register = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, password, role } = req.body;

    if (!fullname || !email || !phoneNumber || !password || !role) {
      return res.status(400).json({
        message: "All fields are required.",
        success: false,
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists with this email",
        success: false,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let profilePhoto = "";
    if (req.file) {
      const fileUri = getDataUri(req.file);
      const cloudResponse = await cloudinary.uploader.upload(
        fileUri.content
      );
      profilePhoto = cloudResponse.secure_url;
    }

    await User.create({
      fullname,
      email,
      phoneNumber,
      password: hashedPassword,
      role,
      profile: { profilePhoto },
    });

    return res.status(201).json({
      message: "Account created successfully",
      success: true,
    });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};

/* =====================================================
   LOGIN USER
===================================================== */
export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({
        message: "Something is missing.",
        success: false,
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Incorrect email or password.",
        success: false,
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        message: "Incorrect email or password.",
        success: false,
      });
    }

    if (role !== user.role) {
      return res.status(400).json({
        message: "Account doesn't exist with current role",
        success: false,
      });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    const safeUser = user.toObject();
    delete safeUser.password;

    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
        secure: false,
      })
      .json({
        message: `Welcome back ${safeUser.fullname}`,
        token,
        user: safeUser,
        success: true,
      });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};

/* =====================================================
   LOGOUT USER
===================================================== */
export const logout = async (req, res) => {
  try {
    res
      .status(200)
      .clearCookie("token", {
        httpOnly: true,
        sameSite: "strict",
        secure: false,
      })
      .json({
        success: true,
        message: "Logged out successfully",
      });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Logout failed",
    });
  }
};

/* =====================================================
   UPDATE PROFILE (STUDENT / COMMON) + RESUME PARSING
===================================================== */
export const updateProfile = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, bio, skills } = req.body;
    const file = req.file;

    // 🔹 Parse skills from frontend
    let skillsArray;
    if (skills) {
      skillsArray = Array.isArray(skills)
        ? skills
        : skills.split(",").map(s => s.trim()).filter(Boolean);
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(400).json({
        message: "User not found",
        success: false,
      });
    }

    // 🔹 Update basic fields
    if (fullname) user.fullname = fullname;
    if (email) user.email = email;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (bio) user.profile.bio = bio;
    if (skillsArray) user.profile.skills = skillsArray;

    /* ================== RESUME + ML ================== */
    if (file) {
      console.log("📄 Resume uploaded:", file.originalname);

      user.profile.resume = file.buffer;
      user.profile.resumeOriginalName = file.originalname;

      try {
        const formData = new FormData();
        formData.append("file", file.buffer, {
          filename: file.originalname,
        });

        console.log("🚀 Calling Flask ML service...");
        const pyRes = await axios.post(
          "http://127.0.0.1:5001/parse_resume",
          formData,
          {
            headers: formData.getHeaders(),
            timeout: 30000,
          }
        );

        const mlSkills = pyRes.data.skills;
        console.log("✅ ML Skills:", mlSkills);

        if (Array.isArray(mlSkills) && mlSkills.length > 0) {
          user.profile.skills = mlSkills;
          console.log("🔄 Skills overwritten by ML");
        }
      } catch (err) {
        console.log("⚠️ ML failed, keeping manual skills:", err.message);
      }
    }

    await user.save();

    const safeUser = user.toObject();
    delete safeUser.password;

    return res.status(200).json({
      message: "Profile updated successfully",
      user: safeUser,
      success: true,
    });
  } catch (error) {
    console.error("Profile update error:", error);
    return res.status(500).json({
      message: "Profile update failed",
      success: false,
    });
  }
};

/* =====================================================
   UPDATE RECRUITER PROFILE + COMPANY
===================================================== */
export const updateRecruiterProfile = async (req, res) => {
  try {
    const { bio, companyName, description, website, location, logo } = req.body;

    if (!companyName) {
      return res.status(400).json({
        message: "Company name is required",
        success: false,
      });
    }

    const user = await User.findById(req.user._id);
    if (!user || user.role !== "recruiter") {
      return res.status(403).json({
        message: "Access denied",
        success: false,
      });
    }

    let company = await Company.findOne({ name: companyName });

    if (!company) {
      company = await Company.create({
        name: companyName,
        description,
        website,
        location,
        logo,
        recruiter: user._id,
      });
    }

    if (bio) user.profile.bio = bio;
    user.profile.company = company._id;

    await user.save();

    const populatedUser = await User.findById(user._id).populate(
      "profile.company"
    );

    const safeUser = populatedUser.toObject();
    delete safeUser.password;

    return res.status(200).json({
      message: "Recruiter profile updated successfully",
      success: true,
      user: safeUser,
    });
  } catch (error) {
    console.error("Recruiter profile error:", error);
    return res.status(500).json({
      message: "Recruiter profile update failed",
      success: false,
    });
  }
};
