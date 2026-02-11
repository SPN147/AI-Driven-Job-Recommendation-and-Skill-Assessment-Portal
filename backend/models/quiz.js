import mongoose from "mongoose";

// ------------------------------------------------------------
// Quiz Schema
// ------------------------------------------------------------
const quizSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    role: {
      type: String,
      required: true,
    },

    experience: {
      type: String,
      required: true,
    },

    topics: {
      type: [String],
      required: true,
    },

    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "medium",
    },

    timeLimit: {
      type: Number,
      default: 15,
    },

    questions: [
      {
        question: {
          type: String,
          required: true,
        },
        options: {
          type: [String],
          required: true,
        },
        // ✅ MUST BE NUMBER
        correctAnswer: {
          type: Number,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

const Quiz = mongoose.model("Quiz", quizSchema);
export default Quiz;
