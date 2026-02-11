import React, { useEffect, useState } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { useParams } from "react-router-dom";
import axios from "axios";
import { setSingleJob } from "@/redux/jobSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  JOB_API_END_POINT,
  APPLICATION_JOB_API_END_POINT,
} from "@/utils/constant";
import { toast } from "sonner";

const ML_MATCH_API = "http://localhost:5001/recommend";

const JobDescription = () => {
  const { id: jobId } = useParams();
  const dispatch = useDispatch();

  const { user } = useSelector((store) => store.auth);
  const { singleJob } = useSelector((store) => store.job);

  const [isApplied, setIsApplied] = useState(false);
  const [matchScore, setMatchScore] = useState(null);
  const [mlLoading, setMlLoading] = useState(false);

  // ===============================
  // Apply Job
  // ===============================
  const applyJobHandler = async () => {
    try {
      const res = await axios.post(
        `${APPLICATION_JOB_API_END_POINT}/apply/${jobId}`,
        {},
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        setIsApplied(true);

        dispatch(
          setSingleJob({
            ...singleJob,
            applications: [
              ...singleJob.applications,
              { applicant: user._id },
            ],
          })
        );
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to apply");
    }
  };

  // ===============================
  // ML MATCH FUNCTION
  // ===============================
  const runMLMatch = async (job) => {
    const userSkills = user?.profile?.skills || [];
    if (userSkills.length === 0) return;

    try {
      setMlLoading(true);

      const res = await axios.post(ML_MATCH_API, {
        jobs: [job],
        skills: userSkills,
      });

      console.log("ML RESPONSE:", res.data);

      if (Array.isArray(res.data) && res.data.length > 0) {
        setMatchScore(res.data[0].score); // 0 → 1
      }

    } catch (error) {
      console.log("ML match failed:", error);
    } finally {
      setMlLoading(false);
    }
  };

  // ===============================
  // Fetch Job + Trigger ML
  // ===============================
  useEffect(() => {
    if (!jobId || !user) return;

    const fetchSingleJob = async () => {
      try {
        const res = await axios.get(
          `${JOB_API_END_POINT}/get/${jobId}`,
          { withCredentials: true }
        );

        if (res.data.success) {
          const job = res.data.job;
          dispatch(setSingleJob(job));

          const applied = job.applications?.some(
            (app) => app.applicant?._id === user?._id
          );
          setIsApplied(applied);

          if (user?.profile?.skills?.length > 0) {
            runMLMatch(job);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchSingleJob();

  }, [jobId, user]); // 🔥 important dependency

  // ===============================
  // Match Badge Renderer
  // ===============================
  const renderMatchBadge = () => {
    if (mlLoading)
      return <Badge variant="secondary">Analyzing fit…</Badge>;

    if (matchScore === null)
      return null;

    const percentage = Math.round(matchScore * 100);

    if (percentage >= 70)
      return (
        <Badge className="bg-green-600">
          {percentage}% Strong Match
        </Badge>
      );

    if (percentage >= 40)
      return (
        <Badge className="bg-yellow-500">
          {percentage}% Average Match
        </Badge>
      );

    return (
      <Badge className="bg-red-600">
        {percentage}% Low Match
      </Badge>
    );
  };

  return (
    <div className="max-w-7xl mx-auto my-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-xl">
            {singleJob?.title}
          </h1>

          <div className="flex items-center gap-2 mt-4 flex-wrap">
            <Badge variant="ghost" className="text-blue-700 font-bold">
              {singleJob?.position} Positions
            </Badge>

            <Badge variant="ghost" className="text-[#f83002] font-bold">
              {singleJob?.jobType}
            </Badge>

            <Badge variant="ghost" className="text-[#7209b7] font-bold">
              {singleJob?.salary} LPA
            </Badge>

            {renderMatchBadge()}
          </div>
        </div>

        <Button
          onClick={isApplied ? null : applyJobHandler}
          disabled={isApplied}
          className={`rounded-lg ${
            isApplied
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-[rgb(144,24,224)] hover:bg-[rgb(78,8,121)]"
          }`}
        >
          {isApplied ? "Already Applied" : "Apply Now"}
        </Button>
      </div>

      <h1 className="border-b-2 border-gray-300 font-medium py-4">
        Job Description
      </h1>

      <div className="my-4 space-y-2">
        <p><b>Role:</b> {singleJob?.title}</p>
        <p><b>Location:</b> {singleJob?.location}</p>
        <p><b>Description:</b> {singleJob?.description}</p>
        <p><b>Experience:</b> {singleJob?.experienceLevel} yrs</p>
        <p><b>Salary:</b> {singleJob?.salary} LPA</p>
        <p><b>Total Applicants:</b> {singleJob?.applications?.length}</p>
        <p>
          <b>Posted Date:</b>{" "}
          {singleJob?.createdAt?.split("T")[0]}
        </p>
      </div>
    </div>
  );
};

export default JobDescription;
