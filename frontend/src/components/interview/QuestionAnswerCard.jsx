import { useState } from "react";
import { Button } from "@/components/ui/button";

/**
 * Props expected:
 * - questionData : { _id, question, answer, note, isPinned }
 * - onSaveAnswer : function(answerText)
 * - onTogglePin  : function()
 */
const QuestionAnswerCard = ({
  questionData,
  onSaveAnswer,
  onTogglePin,
}) => {
  const [userAnswer, setUserAnswer] = useState("");
  const [note, setNote] = useState(questionData.note || "");

  return (
    <div className="bg-white rounded-lg shadow-md p-5">
      {/* HEADER */}
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold">
          Interview Question
        </h3>

        <button
          onClick={onTogglePin}
          className={`text-sm px-2 py-1 rounded ${
            questionData.isPinned
              ? "bg-yellow-200"
              : "bg-gray-100"
          }`}
        >
          {questionData.isPinned ? "📌 Pinned" : "📍 Pin"}
        </button>
      </div>

      {/* QUESTION */}
      <p className="text-gray-800 mb-4">
        {questionData.question}
      </p>

      {/* ANSWER INPUT */}
      <label className="block text-sm font-medium mb-1">
        Your Answer
      </label>
      <textarea
        rows={4}
        className="w-full p-2 border rounded mb-4 text-sm"
        placeholder="Type your answer here..."
        value={userAnswer}
        onChange={(e) => setUserAnswer(e.target.value)}
      />

      {/* NOTES */}
      <label className="block text-sm font-medium mb-1">
        Personal Notes (optional)
      </label>
      <textarea
        rows={2}
        className="w-full p-2 border rounded mb-4 text-sm"
        placeholder="Add your own notes..."
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />

      {/* ACTIONS */}
      <div className="flex justify-end">
        <Button
          onClick={() =>
            onSaveAnswer({
              answer: userAnswer,
              note,
            })
          }
        >
          Save Answer
        </Button>
      </div>
    </div>
  );
};

export default QuestionAnswerCard;
