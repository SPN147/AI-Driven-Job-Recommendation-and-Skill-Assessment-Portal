import express from "express";
import {
  login,
  register,
  updateProfile,
  logout,
  updateRecruiterProfile,
} from "../controllers/user.controller.js";

import isAuthenticated from "../middlewares/isAuthenticated.js";
import isRecruiter from "../middlewares/isRecruiter.js";
import { singleUpload } from "../middlewares/multer.js";

const router = express.Router();

/* ===========================
   AUTH ROUTES
=========================== */
router.route("/register").post(singleUpload, register);
router.route("/login").post(login);
router.route("/logout").get(isAuthenticated, logout);

/* ===========================
   COMMON USER PROFILE
   (Student + basic user)
=========================== */
router.post(
  "/profile/update",
  isAuthenticated,
  singleUpload,
  updateProfile
);

/* ===========================
   RECRUITER PROFILE + COMPANY
=========================== */
router.put(
  "/recruiter/profile",
  isAuthenticated,
  isRecruiter,
  updateRecruiterProfile
);

export default router;
