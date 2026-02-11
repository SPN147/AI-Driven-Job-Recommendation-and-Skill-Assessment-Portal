// Import mongoose ODM
// Used to define schemas and interact with MongoDB
import mongoose from "mongoose";

// ------------------------------------------------------------
// QuizAttempt Schema
// ------------------------------------------------------------
// Represents ONE attempt of a quiz by a user
// Created every time a user submits a quiz
const quizAttemptSchema = new mongoose.Schema(
  {
    // Reference to the user who attempted the quiz
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Reference to the quiz being attempted
    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      required: true,
    },

    // Detailed answer analysis for each question
    answers: [
      {
        question: {
          type: String,
          required: true,
        },
        userAnswer: {
          type: String,
          required: true,
        },
        isCorrect: {
          type: Boolean,
          required: true,
        },
        feedback: {
          type: String,
          default: "",
        },
      },
    ],

    // Number of correct answers
    score: {
      type: Number,
      required: true,
    },

    // Total number of questions in quiz
    totalQuestions: {
      type: Number,
      required: true,
    },

    // Percentage score
    percentage: {
      type: Number,
      required: true,
    },

    // Overall AI-generated review
    review: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt automatically
  }
);

// Export QuizAttempt model
// MongoDB collection name → "quizattempts"
const QuizAttempt = mongoose.model("QuizAttempt", quizAttemptSchema);
export default QuizAttempt;
