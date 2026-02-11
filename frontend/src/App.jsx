import { createBrowserRouter, RouterProvider } from "react-router-dom";

/* =========================
   AUTH
========================= */
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";

/* =========================
   STUDENT / PUBLIC
========================= */
import Home from "./components/Home";
import Jobs from "./components/Jobs";
import Browse from "./components/Browse";
import Profile from "./components/Profile";
import JobDescription from "./components/JobDescription";

import SkillTest from "./components/assessment/skillTest";
import TestResult from "./components/assessment/TestResult";

import InterviewPrep from "./components/interview/InterviewPrep";
import InterviewSession from "./components/interview/InterviewSession";

/* =========================
   LAYOUTS
========================= */
import AppLayout from "./components/shared/AppLayout";

/* =========================
   RECRUITER
========================= */
import ProtectedRecruiterRoute from "./components/shared/ProtectedRecruiterRoute";
import RecruiterLayout from "./components/recruiter/RecruiterLayout";
import RecruiterDashboard from "./components/recruiter/RecruiterDashboard";
import RecruiterJobs from "./components/recruiter/RecruiterJobs";
import JobApplicants from "./components/recruiter/JobApplicants"; // ✅ REQUIRED
import PostJob from "./components/recruiter/PostJob";
import RecruiterProfile from "./components/recruiter/RecruiterProfile";
import EditRecruiterProfile from "./components/recruiter/EditRecruiterProfile";

/* =========================
   ROUTER
========================= */
const appRouter = createBrowserRouter([
  /* =========================
     STUDENT / PUBLIC ROUTES
  ========================= */
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "jobs", element: <Jobs /> },
      { path: "browse", element: <Browse /> },
      { path: "profile", element: <Profile /> },
      { path: "description/:id", element: <JobDescription /> },
      { path: "assessment", element: <SkillTest /> },
      { path: "interview-prep", element: <InterviewPrep /> },
      { path: "interview/:sessionId", element: <InterviewSession /> },
      { path: "test-results", element: <TestResult /> },
    ],
  },

  /* =========================
     RECRUITER ROUTES
  ========================= */
  {
    path: "/recruiter",
    element: (
      <ProtectedRecruiterRoute>
        <RecruiterLayout />
      </ProtectedRecruiterRoute>
    ),
    children: [
      { path: "dashboard", element: <RecruiterDashboard /> },
      { path: "jobs", element: <RecruiterJobs /> },
      { path: "jobs/:jobId/applicants", element: <JobApplicants /> }, // ✅ FIXED
      { path: "post-job", element: <PostJob /> },
      { path: "profile", element: <RecruiterProfile /> },
      { path: "edit-profile", element: <EditRecruiterProfile /> },
    ],
  },

  /* =========================
     AUTH ROUTES
  ========================= */
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <Signup /> },
]);

function App() {
  return <RouterProvider router={appRouter} />;
}

export default App;
