import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import QuestionAnswerCard from "@/components/interview/QuestionAnswerCard";

const InterviewSession = () => {
  const { sessionId } = useParams();

  const [session, setSession] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // ================= FETCH SESSION =================
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/api/sessions/${sessionId}`,
          { withCredentials: true }
        );

        setSession(res.data.session);
        setQuestions(res.data.session.questions);
      } catch (err) {
        console.error(err);
        alert("Failed to load session");
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [sessionId]);

  // ================= SAVE ANSWER =================
  const handleSaveAnswer = async ({ answer, note }) => {
    const questionId = questions[currentIndex]._id;

    try {
      await axios.put(
        `http://localhost:8000/api/questions/${questionId}`,
        { answer, note },
        { withCredentials: true }
      );

      // Update local state
      const updated = [...questions];
      updated[currentIndex] = {
        ...updated[currentIndex],
        answer,
        note,
      };
      setQuestions(updated);
    } catch (err) {
      console.error(err);
      alert("Failed to save answer");
    }
  };

  // ================= PIN QUESTION =================
  const togglePin = async () => {
    const questionId = questions[currentIndex]._id;
    const isPinned = !questions[currentIndex].isPinned;

    try {
      await axios.patch(
        `http://localhost:8000/api/questions/${questionId}/pin`,
        { isPinned },
        { withCredentials: true }
      );

      const updated = [...questions];
      updated[currentIndex].isPinned = isPinned;
      setQuestions(updated);
    } catch (err) {
      console.error(err);
      alert("Failed to update pin");
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center">
        Loading interview session...
      </div>
    );
  }

  if (!session || questions.length === 0) {
    return (
      <div className="p-6 text-center">
        No questions found for this session.
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* HEADER */}
      <div className="mb-4 text-center">
        <h1 className="text-2xl font-bold">
          {session.role} Interview
        </h1>
        <p className="text-sm text-gray-600">
          Experience: {session.experience}
        </p>
      </div>

      {/* QUESTION CARD */}
      <QuestionAnswerCard
        questionData={questions[currentIndex]}
        onSaveAnswer={handleSaveAnswer}
        onTogglePin={togglePin}
      />

      {/* NAVIGATION */}
      <div className="flex justify-between mt-6">
        <Button
          variant="outline"
          disabled={currentIndex === 0}
          onClick={() => setCurrentIndex((i) => i - 1)}
        >
          Previous
        </Button>

        <span className="text-sm text-gray-600 self-center">
          Question {currentIndex + 1} of {questions.length}
        </span>

        <Button
          disabled={currentIndex === questions.length - 1}
          onClick={() => setCurrentIndex((i) => i + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default InterviewSession;
