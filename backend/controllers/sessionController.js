// ------------------------------------------------------------
// Imports
// ------------------------------------------------------------
import { GoogleGenAI } from "@google/genai";
import { questionAnswerPrompt } from "../utils/prompts.js";
import Session from "../models/session.js";
import Question from "../models/question.js";

// ------------------------------------------------------------
// @desc    Create a new interview session WITH AI questions
// @route   POST /api/sessions/create
// @access  Private (JWT required)
// ------------------------------------------------------------
export const createSession = async (req, res) => {
  try {
    const {
      role,
      experience,
      topicsToFocus,
      description,
      numberOfQuestions = 5,
    } = req.body;

    const userId = req.user._id;

    // 1️⃣ Create session first
    const session = await Session.create({
      user: userId,
      role,
      experience,
      topicsToFocus,
      description,
    });

    // 2️⃣ Initialize Gemini INSIDE function (safe)
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    // 3️⃣ Build prompt
    const prompt = questionAnswerPrompt(
      role,
      experience,
      topicsToFocus.join(", "),
      numberOfQuestions
    );

    // 4️⃣ Generate questions
    const aiResponse = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    });

    const rawText = aiResponse.response.text();

    // 5️⃣ Safe JSON extraction
    const jsonStart = rawText.indexOf("{");
    const jsonEnd = rawText.lastIndexOf("}") + 1;
    const parsed = JSON.parse(rawText.slice(jsonStart, jsonEnd));

    // 6️⃣ Save questions
    const questionDocs = await Promise.all(
      parsed.questions.map(async (q) => {
        const question = await Question.create({
          session: session._id,
          question: q.question,
          answer: q.answer,
        });
        return question._id;
      })
    );

    // 7️⃣ Attach questions to session
    session.questions = questionDocs;
    await session.save();

    // 8️⃣ Respond
    res.status(201).json({
      success: true,
      sessionId: session._id,
    });

  } catch (error) {
    console.error("CREATE SESSION ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create interview session",
    });
  }
};

// ------------------------------------------------------------
// @desc    Get all sessions of logged-in user
// @route   GET /api/sessions/my-sessions
// ------------------------------------------------------------
export const getMySessions = async (req, res) => {
  try {
    const sessions = await Session.find({
      user: req.user._id,
    })
      .sort({ createdAt: -1 })
      .populate("questions");

    res.status(200).json(sessions);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// ------------------------------------------------------------
// @desc    Get session by ID
// @route   GET /api/sessions/:id
// ------------------------------------------------------------
export const getSessionById = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id).populate({
      path: "questions",
      options: { sort: { isPinned: -1, createdAt: 1 } },
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found",
      });
    }

    res.status(200).json({
      success: true,
      session,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// ------------------------------------------------------------
// @desc    Delete a session and its questions
// @route   DELETE /api/sessions/:id
// ------------------------------------------------------------
export const deleteSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);

    if (!session) {
      return res.status(404).json({
        message: "Session not found",
      });
    }

    if (session.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        message: "Not authorized to delete this session",
      });
    }

    await Question.deleteMany({ session: session._id });
    await session.deleteOne();

    res.status(200).json({
      success: true,
      message: "Session deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};
