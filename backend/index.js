// 🔴 MUST BE FIRST
import dotenv from "dotenv";
dotenv.config();

// Optional but safe
process.env.GOOGLE_APPLICATION_CREDENTIALS = "";

import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import connectDB from "./utils/db.js";

// routes
import sessionRoutes from "./routes/sessionRoutes.js";
import questionRoutes from "./routes/questionRoutes.js";
import quizRoutes from "./routes/quizRoutes.js";
import userRoute from "./routes/user.route.js";
import companyRoute from "./routes/company.route.js";
import jobRoute from "./routes/job.route.js";
import applicationRoute from "./routes/application.route.js";

// middleware
import isAuthenticated from "./middlewares/isAuthenticated.js";

// controllers
import {
  generateInterviewQuestions,
  generateConceptExplanation,
} from "./controllers/aiController.js";

const app = express();

// DB
connectDB();

// middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

// 🔥 MISSING ROUTES (THIS WAS THE BUG)
app.use("/api/sessions", sessionRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/quiz", quizRoutes);

app.use("/api/v1/user", userRoute);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/application", applicationRoute);

// AI routes
app.post(
  "/api/ai/generate-questions",
  isAuthenticated,
  generateInterviewQuestions
);
app.post(
  "/api/ai/generate-explanation",
  isAuthenticated,
  generateConceptExplanation
);

// start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
