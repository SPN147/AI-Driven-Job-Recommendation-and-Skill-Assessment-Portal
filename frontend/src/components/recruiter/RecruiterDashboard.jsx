import React from "react";
import { useSelector } from "react-redux";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import useGetRecruiterJobs from "@/hooks/useGetRecruiterJobs";

import HiringIllustration from "../../assets/Hiring-amico.svg";

const RecruiterDashboard = () => {
  const navigate = useNavigate();
  useGetRecruiterJobs();

  const { recruiterJobs } = useSelector((store) => store.job);
  const totalJobs = recruiterJobs.length;
  const totalApplicants = recruiterJobs.reduce(
    (sum, job) => sum + (job.applications?.length || 0),
    0
  );

  return (
    <div className="max-w-7xl mx-auto mt-12 px-4">
      
      {/* ===== HERO SECTION ===== */}
      <div
        className="rounded-3xl p-10 mb-12 flex flex-col lg:flex-row items-center justify-between
                   text-white shadow-xl"
        style={{
          background: "linear-gradient(135deg, #6a38c2, #8b5cf6)",
        }}
      >
        {/* LEFT */}
        <div className="lg:w-1/2">
          <h1 className="text-4xl lg:text-5xl font-extrabold mb-4">
            Welcome back 👋
          </h1>

          <p className="text-purple-100 mb-8 text-lg">
            You have{" "}
            <span className="font-semibold text-white">{totalJobs}</span>{" "}
            active job listings and{" "}
            <span className="font-semibold text-white">{totalApplicants}</span>{" "}
            applicants to review today.
          </p>

          <div className="flex flex-wrap gap-4">
            <Button
   className="bg-[#5a2fb0] text-white hover:bg-[#4b2797] px-6 py-2 font-semibold"
  onClick={() => navigate("/recruiter/jobs")}
         >
  + Post New Job
      </Button>

         <Button
  className="bg-[#5a2fb0] text-white hover:bg-[#4b2797] px-6 py-2 font-semibold"
  onClick={() => navigate("/recruiter/jobs")}
     >
  Manage Jobs
</Button>
          </div>
        </div>

        {/* RIGHT IMAGE */}
        <div className="lg:w-1/3 mt-10 lg:mt-0">
          <img
            src={HiringIllustration}
            alt="Hiring Illustration"
            className="w-full max-h-72 object-contain drop-shadow-2xl"
          />
        </div>
      </div>

      {/* ===== STATS ===== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        <div className="bg-white p-8 rounded-2xl shadow-md border border-[#e5d9ff]
                        hover:shadow-xl transition">
          <h2 className="text-gray-500 text-sm uppercase tracking-wide">
            Total Jobs Posted
          </h2>
          <p className="text-5xl font-extrabold mt-3 text-[#6a38c2]">
            {totalJobs}
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-md border border-[#e5d9ff]
                        hover:shadow-xl transition">
          <h2 className="text-gray-500 text-sm uppercase tracking-wide">
            Total Applicants
          </h2>
          <p className="text-5xl font-extrabold mt-3 text-[#6a38c2]">
            {totalApplicants}
          </p>
        </div>

      </div>
    </div>
  );
};

export default RecruiterDashboard;
