import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import OnlineTestSVG from "@/assets/Online test-amico.svg";
import { useNavigate } from "react-router-dom";

const SkillTest = () => {
  const navigate = useNavigate();

  // ================= QUIZ STATES =================
  const [quizId, setQuizId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ================= PROCTOR STATES =================
  const [isProctored, setIsProctored] = useState(false);

  // ================= USER INPUT =================
  const [role, setRole] = useState("Frontend Developer");
  const [experience, setExperience] = useState(0);
  const [skillInput, setSkillInput] = useState("");
  const [numberOfQuestions, setNumberOfQuestions] = useState(5);
  const [difficulty, setDifficulty] = useState("medium");
  const [timeLimit, setTimeLimit] = useState(10);

  // ================= TIMER =================
  useEffect(() => {
    if (timeLeft === null) return;
    if (timeLeft <= 0) {
      submitQuiz();
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  // ================= PROCTOR LOGIC =================
  useEffect(() => {
    if (!isProctored) return;

    const triggerViolation = () => {
      setError("You left the test window. Auto submitting...");
      submitQuiz();
    };

    const handleVisibility = () => {
      if (document.hidden) triggerViolation();
    };

    const handleBlur = () => triggerViolation();

    const handleFullscreenExit = () => {
      if (!document.fullscreenElement) triggerViolation();
    };

    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("blur", handleBlur);
    document.addEventListener("fullscreenchange", handleFullscreenExit);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("blur", handleBlur);
      document.removeEventListener("fullscreenchange", handleFullscreenExit);
    };
  }, [isProctored]);

  const parseTopics = () =>
    skillInput.split(",").map((s) => s.trim()).filter(Boolean);

  // ================= START QUIZ =================
  const startQuiz = async () => {
    const topics = parseTopics();

    if (topics.length === 0) {
      setError("Please enter at least one skill.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:8000/api/quiz/generate",
        {
          role,
          experience: `${experience} years`,
          topics,
          numberOfQuestions,
          difficulty,
          timeLimit,
        },
        { withCredentials: true }
      );

      setQuizId(res.data.quizId);
      setQuestions(res.data.questions);
      setAnswers(Array(res.data.questions.length).fill(null));
      setTimeLeft(res.data.timeLimit * 60);

      await document.documentElement.requestFullscreen();
      setIsProctored(true);
    } catch (err) {
      console.error(err);
      setError("Quiz generation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (optionIndex) => {
    const updated = [...answers];
    updated[current] = optionIndex;
    setAnswers(updated);
  };

  // ================= SUBMIT QUIZ =================
  const submitQuiz = async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      }

      setIsProctored(false);

      const res = await axios.post(
        "http://localhost:8000/api/quiz/submit",
        { quizId, answers },
        { withCredentials: true }
      );

      navigate("/test-results", { state: { result: res.data } });
    } catch (err) {
      console.error(err);
      setError("Quiz submission failed.");
    }
  };

  // ================= BEFORE QUIZ =================
  if (!quizId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-3 py-10">
        <div className="bg-white rounded-lg shadow-md flex w-full max-w-5xl overflow-hidden">
          
          {/* Illustration */}
          <div className="hidden md:flex w-1/2 bg-blue-50 items-center justify-center p-3">
            <img
              src={OnlineTestSVG}
              alt="Illustration"
              className="w-2/3 max-w-xs h-auto"
            />
          </div>

          {/* Form */}
          <div className="w-full md:w-1/2 p-8 overflow-y-auto">
            <h1 className="text-2xl font-bold mb-1 text-center text-blue-600">
              Skill Assessment
            </h1>
            <p className="text-gray-600 text-sm mb-6 text-center">
              Configure your personalized test environment.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block font-bold text-gray-700 mb-1 text-sm uppercase tracking-wide">
                  Job Role
                </label>
                <input
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-400 outline-none"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1 text-sm uppercase tracking-wide">
                  Years of Experience
                </label>
                <input
                  type="number"
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-400 outline-none"
                  value={experience}
                  onChange={(e) => setExperience(Number(e.target.value))}
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1 text-sm uppercase tracking-wide">
                  Skills (Comma Separated)
                </label>
                <input
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-400 outline-none"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1 text-sm uppercase tracking-wide">
                    Questions
                  </label>
                  <input
                    type="number"
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-400 outline-none"
                    value={numberOfQuestions}
                    onChange={(e) =>
                      setNumberOfQuestions(Number(e.target.value))
                    }
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1 text-sm uppercase tracking-wide">
                    Difficulty
                  </label>
                  <select
                    className="w-full p-2 border rounded bg-white focus:ring-2 focus:ring-blue-400 outline-none"
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
              </div>
            </div>

            {/* ERROR MESSAGE */}
            {error && (
              <div className="bg-red-100 text-red-600 p-3 rounded mt-4 text-center text-sm">
                {error}
              </div>
            )}

            <Button
              onClick={startQuiz}
              disabled={loading}
              className="w-full mt-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg"
            >
              {loading ? "Generating Test..." : "Launch Skill Test"}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ================= ACTIVE QUIZ =================
  const q = questions[current];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-10">
      <div className="w-full max-w-3xl bg-white p-8 rounded-xl shadow-lg border-t-4 border-blue-500">
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <span className="font-semibold text-gray-500">
            Question {current + 1} / {questions.length}
          </span>
          <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full font-mono font-bold">
            ⏱ {Math.floor(timeLeft / 60)}:
            {(timeLeft % 60).toString().padStart(2, "0")}
          </span>
        </div>

        <h2 className="text-xl font-semibold mb-6 text-gray-800">
          {q.question}
        </h2>

        <div className="space-y-3">
          {q.options.map((opt, idx) => (
            <label
              key={idx}
              className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                answers[current] === idx
                  ? "border-blue-500 bg-blue-50"
                  : "hover:border-gray-300"
              }`}
            >
              <input
                type="radio"
                checked={answers[current] === idx}
                onChange={() => handleSelect(idx)}
                className="w-4 h-4 text-blue-600"
              />
              <span className="ml-3 text-gray-700 font-medium">{opt}</span>
            </label>
          ))}
        </div>

        <div className="flex justify-between mt-10">
          <Button
            variant="outline"
            disabled={current === 0}
            onClick={() => setCurrent((c) => c - 1)}
          >
            Previous
          </Button>

          {current === questions.length - 1 ? (
            <Button
              onClick={submitQuiz}
              className="bg-green-600 hover:bg-green-700 px-10"
            >
              Finish & Submit
            </Button>
          ) : (
            <Button
              onClick={() => setCurrent((c) => c + 1)}
              className="bg-blue-600 hover:bg-blue-700 px-10"
            >
              Next Question
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SkillTest;
