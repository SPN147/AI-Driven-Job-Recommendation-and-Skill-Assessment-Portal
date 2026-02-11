// Import mongoose ODM
import mongoose from "mongoose";

// ------------------------------------------------------------
// Session Schema
// ------------------------------------------------------------
const sessionSchema = new mongoose.Schema(
  {
    // Reference to the user who owns this session
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Job role the session is focused on
    role: {
      type: String,
      required: true,
    },

    // Experience level (e.g., Fresher, 3 Years)
    experience: {
      type: String,
      required: true,
    },

    // Topics the user wants to focus on in this session
    // ✅ FIX: changed from String → [String]
    topicsToFocus: {
      type: [String],
      required: true,
    },

    // Optional description or goal for the session
    description: {
      type: String,
      default: "",
    },

    // Array of Question IDs linked to this session
    questions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Export Session model
const Session = mongoose.model("Session", sessionSchema);
export default Session;
