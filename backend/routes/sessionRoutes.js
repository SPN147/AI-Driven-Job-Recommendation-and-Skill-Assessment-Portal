// Import Express framework
import express from "express";

// Import session controller functions
import {
  createSession,
  getSessionById,
  getMySessions,
  deleteSession,
} from "../controllers/sessionController.js";

// Import JWT protection middleware
import protect from "../middlewares/isAuthenticated.js";

// Create Express router instance
const router = express.Router();

// ------------------------------------------------------------
// Session Routes
// ------------------------------------------------------------

// Create a new session (Private)
router.post("/create", protect, createSession);

// Get all sessions of logged-in user (Private)
router.get("/my-sessions", protect, getMySessions);

// Get a specific session by ID (Private)
router.get("/:id", protect, getSessionById);

// Delete a session and its related questions (Private)
router.delete("/:id", protect, deleteSession);

// Export router
export default router;
