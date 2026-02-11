// ============================================================
// INTERVIEW QUESTION + ANSWER GENERATION
// ============================================================
export const questionAnswerPrompt = (
  role,
  experience,
  topics,
  numberOfQuestions
) => `
You are an AI that generates interview questions and answers.

ROLE: ${role}
EXPERIENCE: ${experience}
TOPICS: ${topics}
NUMBER OF QUESTIONS: ${numberOfQuestions}

Return ONLY valid JSON.

{
  "questions": [
    {
      "question": "Question text",
      "answer": "Answer text"
    }
  ]
}
`;

// ============================================================
// CONCEPT EXPLANATION
// ============================================================
export const conceptExplainPrompt = (question) => `
Explain the following interview question clearly.

QUESTION: ${question}

Return ONLY valid JSON.

{
  "explanation": "Explanation text"
}
`;

// ============================================================
// QUIZ GENERATION (FIXED 🔥)
// ============================================================
export const quizGeneratePrompt = (
  role,
  experience,
  topics,
  numberOfQuestions,
  difficulty
) => `
Generate ${numberOfQuestions} multiple-choice questions (MCQs).

Role: ${role}
Experience: ${experience}
Topics: ${topics.join(", ")}
Difficulty: ${difficulty}

Rules:
- Exactly 4 options per question
- Only ONE correct answer
- correctAnswer MUST be the INDEX of the correct option (0, 1, 2, or 3)
- Do NOT return option text as correctAnswer
- No markdown
- No explanations

Return ONLY valid JSON.

{
  "questions": [
    {
      "question": "Question text",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": 1
    }
  ]
}
`;

// ============================================================
// QUIZ EVALUATION (ALIGNED WITH BACKEND ✅)
// ============================================================
export const quizEvaluatePrompt = (
  questions,
  answers,
  difficulty
) => `
Evaluate the quiz attempt.

Difficulty: ${difficulty}

Questions (with correctAnswer index):
${JSON.stringify(questions)}

User answers (index-based):
${JSON.stringify(answers)}

Rules:
- Compare user answer index with correctAnswer index
- Calculate score and percentage correctly

Return ONLY valid JSON.

{
  "score": 0,
  "total": ${questions.length},
  "percentage": 0,
  "review": "Short overall feedback"
}
`;
