import { GoogleGenAI } from "@google/genai";
import {
  conceptExplainPrompt,
  questionAnswerPrompt,
} from "../utils/prompts.js";

export const generateInterviewQuestions = async (req, res) => {
  try {
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const { role, experience, topicsToFocus, numberOfQuestions } = req.body;

    if (!role || !experience || !topicsToFocus || !numberOfQuestions) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const prompt = questionAnswerPrompt(
      role,
      experience,
      topicsToFocus,
      numberOfQuestions
    );

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    const data = JSON.parse(
      response.text.replace(/^```json\s*/i, "").replace(/```$/i, "").trim()
    );

    res.status(200).json(data);

  } catch (error) {
    res.status(500).json({
      message: "Failed to generate questions",
      error: error.message,
    });
  }
};

export const generateConceptExplanation = async (req, res) => {
  try {
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const { question } = req.body;
    if (!question) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const prompt = conceptExplainPrompt(question);

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    const data = JSON.parse(
      response.text.replace(/^```json\s*/i, "").replace(/```$/i, "").trim()
    );

    res.status(200).json(data);

  } catch (error) {
    res.status(500).json({
      message: "Failed to generate explanation",
      error: error.message,
    });
  }
};
