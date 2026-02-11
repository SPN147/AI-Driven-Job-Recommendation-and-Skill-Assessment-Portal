import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TestResult = () => {
  const navigate = useNavigate();
  const [attempts, setAttempts] = useState([]);
  const [selectedAttemptId, setSelectedAttemptId] = useState(null);
  const [loading, setLoading] = useState(true);

  // ================= FETCH ATTEMPTS =================
  useEffect(() => {
    const fetchAttempts = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8000/api/quiz/my-attempts",
          { withCredentials: true }
        );
        setAttempts(res.data);
      } catch (err) {
        console.error("Failed to load attempts", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAttempts();
  }, []);

  if (loading) {
    return <p className="text-center mt-20">Loading results...</p>;
  }

  if (attempts.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-xl font-semibold mb-4">
          No quiz attempts found
        </h2>
        <Button onClick={() => navigate("/assessment")}>
          Take Skill Test
        </Button>
      </div>
    );
  }

  const selectedAttempt = attempts.find(
    (a) => a._id === selectedAttemptId
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto">

        {/* ===== PAGE HEADER ===== */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-blue-600">
            Skill Test Results
          </h1>
          <p className="text-gray-600">
            Click on a test to view detailed question review
          </p>
        </div>

        {/* ===== ATTEMPT LIST ===== */}
        <div className="space-y-4 mb-10">
          {attempts.map((attempt, index) => (
            <div
              key={attempt._id}
              onClick={() =>
                setSelectedAttemptId(
                  selectedAttemptId === attempt._id
                    ? null
                    : attempt._id
                )
              }
              className={`cursor-pointer bg-white rounded-xl shadow p-5 border-2 transition ${
                selectedAttemptId === attempt._id
                  ? "border-blue-500"
                  : "border-transparent hover:border-gray-200"
              }`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="font-semibold text-lg">
                    Attempt #{attempts.length - index}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {attempt.quiz.role} • {attempt.quiz.difficulty}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(attempt.createdAt).toLocaleString()}
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-bold">
                    {attempt.score}/{attempt.totalQuestions}
                  </p>
                  <p className="text-sm text-gray-600">
                    {attempt.percentage}%
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ===== QUESTION REVIEW ===== */}
        {selectedAttempt && (
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-bold text-blue-600 mb-2">
              Detailed Review
            </h2>

            <p className="text-gray-700 mb-6">
              <strong>AI Review:</strong> {selectedAttempt.review}
            </p>

            <div className="space-y-6">
              {selectedAttempt.answers.map((ans, idx) => (
                <div
                  key={idx}
                  className={`border-l-8 p-4 rounded ${
                    ans.isCorrect
                      ? "border-green-500 bg-green-50"
                      : "border-red-500 bg-red-50"
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold">
                      Q{idx + 1}. {ans.question}
                    </h3>

                    {ans.isCorrect ? (
                      <CheckCircle2 className="text-green-600" />
                    ) : (
                      <XCircle className="text-red-600" />
                    )}
                  </div>

                  <p className="text-sm">
                    <strong>Your Answer:</strong>{" "}
                    <span
                      className={
                        ans.isCorrect
                          ? "text-green-700"
                          : "text-red-700"
                      }
                    >
                      {ans.userAnswer}
                    </span>
                  </p>

                  <p className="text-sm text-gray-700 mt-1">
                    <strong>Feedback:</strong> {ans.feedback}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===== ACTIONS ===== */}
        <div className="flex justify-center gap-4 mt-10">
          <Button onClick={() => navigate("/assessment")}>
            Take Another Test
          </Button>
          <Button variant="outline" onClick={() => navigate("/")}>
            Go Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TestResult;
