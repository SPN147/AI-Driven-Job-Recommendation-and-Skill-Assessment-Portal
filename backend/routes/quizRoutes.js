// Import Express framework
import express from "express";

// Import quiz controller functions
import {
  generateQuiz,
  submitQuiz,
  getMyQuizAttempts,
} from "../controllers/quizController.js";

// Import JWT protection middleware
import protect from "../middlewares/isAuthenticated.js";

// Create Express router instance
const router = express.Router();

// ------------------------------------------------------------
// Quiz Routes
// ------------------------------------------------------------

// Generate a new quiz (Private)
router.post("/generate", protect, generateQuiz);

// Submit quiz answers and evaluate results (Private)
router.post("/submit", protect, submitQuiz);

// Get all quiz attempts of the logged-in user (Private)
router.get("/my-attempts", protect, getMyQuizAttempts);

// Export router
export default router;
