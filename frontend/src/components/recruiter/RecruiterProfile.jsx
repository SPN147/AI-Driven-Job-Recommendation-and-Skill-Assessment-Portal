import React from "react";
import { useSelector } from "react-redux";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";

const RecruiterProfile = () => {
  const navigate = useNavigate();

  const { user } = useSelector((store) => store.auth);
  const { recruiterJobs } = useSelector((store) => store.job);

  const totalJobs = recruiterJobs?.length || 0;
  const totalApplicants = recruiterJobs?.reduce(
    (sum, job) => sum + (job.applications?.length || 0),
    0
  );

  // ✅ CORRECT company path
  const company = user?.profile?.company;

  return (
    <div className="max-w-5xl mx-auto mt-12 px-4">
      <div className="bg-white rounded-2xl shadow-lg border p-8">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Recruiter Profile
            </h1>
            <p className="text-gray-500">
              Manage your recruiter account details
            </p>
          </div>

          <Button
            className="bg-[#6a38c2] hover:bg-[#5b2fb3] text-white px-6"
            onClick={() => navigate("/recruiter/edit-profile")}
          >
            Edit Profile
          </Button>
        </div>

        {/* CONTENT */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* PERSONAL INFO */}
          <div className="border rounded-xl p-6">
            <h2 className="text-lg font-semibold text-[#6a38c2] mb-4">
              Personal Information
            </h2>

            <div className="space-y-3 text-gray-700">
              <p>
                <span className="font-medium">Name:</span>{" "}
                {user?.fullname || "N/A"}
              </p>
              <p>
                <span className="font-medium">Email:</span>{" "}
                {user?.email}
              </p>
              <p>
                <span className="font-medium">Role:</span>{" "}
                Recruiter
              </p>
              <p>
                <span className="font-medium">Account Status:</span>{" "}
                <span className="text-green-600 font-semibold">
                  Active
                </span>
              </p>
            </div>
          </div>

          {/* ✅ COMPANY INFO (FIXED) */}
          <div className="border rounded-xl p-6">
            <h2 className="text-lg font-semibold text-[#6a38c2] mb-4">
              Company Information
            </h2>

            <div className="space-y-3 text-gray-700">
              <p>
                <span className="font-medium">Company Name:</span>{" "}
                {company?.name || "Not Registered"}
              </p>
              <p>
                <span className="font-medium">Location:</span>{" "}
                {company?.location || "—"}
              </p>
              <p>
                <span className="font-medium">Website:</span>{" "}
                {company?.website || "—"}
              </p>
            </div>
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
          <div className="bg-[#f3edff] rounded-xl p-6">
            <h3 className="text-gray-600 text-sm uppercase">
              Jobs Posted
            </h3>
            <p className="text-4xl font-extrabold text-[#6a38c2] mt-2">
              {totalJobs}
            </p>
          </div>

          <div className="bg-[#f3edff] rounded-xl p-6">
            <h3 className="text-gray-600 text-sm uppercase">
              Total Applicants
            </h3>
            <p className="text-4xl font-extrabold text-[#6a38c2] mt-2">
              {totalApplicants}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default RecruiterProfile;
