// Import Express framework
import express from "express";

// Import controller functions for question-related operations
import {
  addQuestionsToSession,
  togglePinQuestion,
  updateQuestionNote,
} from "../controllers/questionController.js";

// Import JWT protection middleware
import protect from "../middlewares/isAuthenticated.js";

// Create Express router instance
const router = express.Router();

// ------------------------------------------------------------
// Question Routes
// ------------------------------------------------------------

// Add additional questions to an existing session (Private)
router.post("/add", protect, addQuestionsToSession);

// Pin or unpin a question by ID (Private)
router.post("/:id/pin", protect, togglePinQuestion);

// Update personal note for a question (Private)
router.post("/:id/note", protect, updateQuestionNote);

// ✅ DEFAULT EXPORT (IMPORTANT)
export default router;
