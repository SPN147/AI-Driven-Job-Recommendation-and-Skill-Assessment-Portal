// ------------------------------------------------------------
// Import Models
// ------------------------------------------------------------
import Quiz from "../models/quiz.js";
import QuizAttempt from "../models/quizAttempt.js";

// ------------------------------------------------------------
// Import Prompts
// ------------------------------------------------------------
import {
  quizGeneratePrompt,
  quizEvaluatePrompt,
} from "../utils/prompts.js";

// ------------------------------------------------------------
// Import Gemini SDK
// ------------------------------------------------------------
import { GoogleGenAI } from "@google/genai";

// ============================================================
// GENERATE QUIZ
// ============================================================
export const generateQuiz = async (req, res) => {
  try {
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const {
      role,
      experience,
      topics,
      numberOfQuestions,
      difficulty = "medium",
      timeLimit = 15,
    } = req.body;

    if (!role || !experience || !topics || !numberOfQuestions) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }

    const prompt = quizGeneratePrompt(
      role,
      experience,
      topics,
      numberOfQuestions,
      difficulty
    );

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    const cleanedText = response.text
      .replace(/^```json\s*/i, "")
      .replace(/```$/i, "")
      .trim();

    const data = JSON.parse(cleanedText);

    // 🔥 NORMALIZE AI OUTPUT (string → index)
    const normalizedQuestions = data.questions.map((q) => {
      let correctIndex = q.correctAnswer;

      if (typeof correctIndex === "string") {
        correctIndex = q.options.findIndex(
          (opt) =>
            opt.toLowerCase().trim() ===
            q.correctAnswer.toLowerCase().trim()
        );
      }

      if (
        typeof correctIndex !== "number" ||
        correctIndex < 0 ||
        correctIndex > 3
      ) {
        correctIndex = 0; // fallback safety
      }

      return {
        question: q.question,
        options: q.options,
        correctAnswer: correctIndex,
      };
    });

    const quiz = await Quiz.create({
      user: req.user._id,
      role,
      experience,
      topics,
      difficulty,
      timeLimit,
      questions: normalizedQuestions,
    });

    res.status(201).json({
      quizId: quiz._id,
      difficulty: quiz.difficulty,
      timeLimit: quiz.timeLimit,
      questions: quiz.questions.map((q) => ({
        question: q.question,
        options: q.options,
      })),
    });

  } catch (error) {
    res.status(500).json({
      message: "Quiz generation failed",
      error: error.message,
    });
  }
};

// ============================================================
// SUBMIT QUIZ (FIXED FEEDBACK LOGIC 🔥)
// ============================================================
export const submitQuiz = async (req, res) => {
  try {
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const { quizId, answers } = req.body;

    if (!quizId || !Array.isArray(answers)) {
      return res.status(400).json({
        message: "quizId and answers array are required",
      });
    }

    const quiz = await Quiz.findOne({
      _id: quizId,
      user: req.user._id,
    });

    if (!quiz) {
      return res.status(404).json({
        message: "Quiz not found",
      });
    }

    // ---------- EVALUATE ANSWERS ----------
    const formattedAnswers = quiz.questions.map((q, index) => {
      const userIndex = answers[index];
      const correctIndex = q.correctAnswer;

      const correctOptionText = q.options[correctIndex];
      const userOptionText =
        typeof userIndex === "number"
          ? q.options[userIndex]
          : "Not Answered";

      const isCorrect = userIndex === correctIndex;

      return {
        question: q.question,
        userAnswer: userOptionText,
        isCorrect,
        feedback: isCorrect
          ? "Correct answer ✅"
          : `Correct answer is: ${correctOptionText}`,
      };
    });

    const score = formattedAnswers.filter(a => a.isCorrect).length;

    // ---------- OPTIONAL AI REVIEW ----------
    let reviewText = "Good attempt. Keep practicing!";
    try {
      const prompt = quizEvaluatePrompt(
        quiz.questions,
        answers,
        quiz.difficulty
      );

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });

      const cleanedText = response.text
        .replace(/^```json\s*/i, "")
        .replace(/```$/i, "")
        .trim();

      const evaluation = JSON.parse(cleanedText);
      if (evaluation.review) reviewText = evaluation.review;
    } catch {
      // AI review failure should NOT break submission
    }

    const attempt = await QuizAttempt.create({
      user: req.user._id,
      quiz: quizId,
      answers: formattedAnswers,
      score,
      totalQuestions: quiz.questions.length,
      percentage: (score / quiz.questions.length) * 100,
      review: reviewText,
    });

    res.status(200).json(attempt);

  } catch (error) {
    res.status(500).json({
      message: "Quiz submission failed",
      error: error.message,
    });
  }
};

// ============================================================
// GET MY QUIZ ATTEMPTS
// ============================================================
export const getMyQuizAttempts = async (req, res) => {
  const attempts = await QuizAttempt.find({
    user: req.user._id,
  })
    .populate("quiz", "role topics difficulty")
    .sort({ createdAt: -1 });

  res.status(200).json(attempts);
};
