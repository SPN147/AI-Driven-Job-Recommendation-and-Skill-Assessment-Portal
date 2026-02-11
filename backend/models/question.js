// Import mongoose ODM
// Used to define schema and interact with MongoDB
import mongoose from "mongoose";

// ------------------------------------------------------------
// Question Schema
// ------------------------------------------------------------
// Represents an individual interview / quiz question
// Each question belongs to one Session
const questionSchema = new mongoose.Schema(
  {
    // Reference to the parent Session document
    session: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
    },

    // Actual question text
    question: {
      type: String,
      required: true,
    },

    // Correct / suggested answer for the question
    answer: {
      type: String,
      required: true,
    },

    // User-added note
    note: {
      type: String,
      default: "",
    },

    // Flag to mark important questions
    isPinned: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Export Question model
// MongoDB collection name → "questions"
const Question = mongoose.model("Question", questionSchema);
export default Question;
