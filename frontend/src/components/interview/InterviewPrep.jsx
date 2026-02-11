import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import InterviewSVG from "../../assets/Thesis-amico.svg";

const InterviewPrep = () => {
  const navigate = useNavigate();

  const [role, setRole] = useState("");
  const [experience, setExperience] = useState("");
  const [topicsToFocus, setTopicsToFocus] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreateSession = async (e) => {
    e.preventDefault();

    if (!role || !experience || !topicsToFocus) {
      alert("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);

      const topicsArray = topicsToFocus
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const res = await axios.post(
        "http://localhost:8000/api/sessions/create",
        {
          role,
          experience,
          topicsToFocus: topicsArray,
          description,
          numberOfQuestions: 5,
        },
        {
          withCredentials: true, // ✅ cookie-based auth
        }
      );

      navigate(`/interview/${res.data.sessionId}`);

    } catch (err) {
      console.error(err);
      alert("Failed to create interview session");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg flex w-full max-w-5xl overflow-hidden">

        {/* LEFT: SVG */}
        <div className="hidden md:flex w-1/2 bg-blue-50 items-center justify-center p-6">
          <img
            src={InterviewSVG}
            alt="Interview Preparation Illustration"
            className="w-3/4 h-auto"
          />
        </div>

        {/* RIGHT: FORM */}
        <div className="w-full md:w-1/2 p-6">
          <h2 className="text-2xl font-bold text-center mb-6">
            Interview Preparation
          </h2>

          <form onSubmit={handleCreateSession}>
            {/* Role */}
            <label className="block font-medium mb-1">
              Role / Skill
            </label>
            <input
              type="text"
              placeholder="Java Developer, MERN, System Design"
              className="w-full p-2 border rounded mb-4"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            />

            {/* Experience */}
            <label className="block font-medium mb-1">
              Experience Level
            </label>
            <select
              className="w-full p-2 border rounded mb-4"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
            >
              <option value="">Select Experience</option>
              <option value="Fresher">Fresher</option>
              <option value="1-3 Years">1–3 Years</option>
              <option value="3+ Years">3+ Years</option>
            </select>

            {/* Topics */}
            <label className="block font-medium mb-1">
              Topics to Focus
            </label>
            <input
              type="text"
              placeholder="DSA, OOPS, DBMS, OS"
              className="w-full p-2 border rounded mb-4"
              value={topicsToFocus}
              onChange={(e) => setTopicsToFocus(e.target.value)}
            />

            {/* Description */}
            <label className="block font-medium mb-1">
              Session Goal (optional)
            </label>
            <textarea
              className="w-full p-2 border rounded mb-6"
              placeholder="Prepare for product-based company interviews"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            >
              {loading ? "Creating Interview Session..." : "Start Interview Session"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default InterviewPrep;
