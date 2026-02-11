import React from "react";
import { useSelector } from "react-redux";
import useGetRecruiterJobs from "@/hooks/useGetRecruiterJobs";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { useNavigate } from "react-router-dom";

const RecruiterJobs = () => {
  const navigate = useNavigate();

  // fetch recruiter jobs
  useGetRecruiterJobs();

  // ✅ FIXED: recruiter jobs
  const { recruiterJobs } = useSelector((store) => store.job);

  return (
    <div className="max-w-6xl mx-auto my-10 px-4">
      <h1 className="text-2xl font-bold mb-6">My Posted Jobs</h1>

      {recruiterJobs.length === 0 ? (
        <div className="text-center text-gray-500 mt-20">
          You haven’t posted any jobs yet.
        </div>
      ) : (
        <div className="space-y-4">
          {recruiterJobs.map((job) => (
            <div
              key={job._id}
              className="bg-white border rounded-xl p-5 flex justify-between items-center shadow-sm"
            >
              <div>
                <h2 className="font-semibold text-lg">{job.title}</h2>
                <p className="text-sm text-gray-500">
                  {job.location} • {job.jobType}
                </p>

                <div className="flex gap-2 mt-2">
                  <Badge variant="outline">
                    {job.applications?.length || 0} Applicants
                  </Badge>
                  <Badge variant="outline">
                    {job.position} Positions
                  </Badge>
                </div>
              </div>

              <Button
                variant="outline"
                onClick={() =>
                  navigate(`/recruiter/jobs/${job._id}/applicants`)
                }
              >
                View Applicants
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecruiterJobs;
