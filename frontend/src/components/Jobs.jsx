import React, { useState, useEffect } from "react";
import FilterCard from "./FilterCard";
import Job from "./Job";
import { useSelector } from "react-redux";
import useGetAllJobs from "@/hooks/useGetAllJobs";
import { Input } from "./ui/input";
import axios from "axios";

const ML_RECOMMEND_API = "http://localhost:5001/recommend";

const Jobs = () => {
  const [keyword, setKeyword] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  const { allJobs } = useSelector((store) => store.job);
  const { user } = useSelector((store) => store.auth);

  useGetAllJobs(keyword);

  useEffect(() => {
    if (!Array.isArray(allJobs) || allJobs.length === 0) {
      setFilteredJobs([]);
      return;
    }

    let jobs = [...allJobs];

    if (keyword.trim() !== "") {
      const query = keyword.toLowerCase();
      jobs = jobs.filter(
        (job) =>
          job?.title?.toLowerCase().includes(query) ||
          job?.company?.name?.toLowerCase().includes(query) ||
          job?.location?.toLowerCase().includes(query)
      );
    }

    recommendJobs(jobs);
  }, [allJobs, keyword, user]);

  const recommendJobs = async (jobs) => {
    const userSkills = user?.profile?.skills || [];

    if (userSkills.length === 0) {
      setFilteredJobs(jobs);
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(ML_RECOMMEND_API, {
        jobs,
        skills: userSkills,
      });

      console.log("ML RESPONSE:", res.data);

      // ✅ Attach score by index
      const jobsWithScore = jobs.map((job, index) => ({
        ...job,
        score: res.data[index]?.score ?? 0,
      }));

      // ✅ Sort descending by score
      const rankedJobs = jobsWithScore.sort(
        (a, b) => b.score - a.score
      );

      setFilteredJobs(rankedJobs);

    } catch (error) {
      console.error("ML recommendation failed:", error);
      setFilteredJobs(jobs);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto mt-5 px-4">
      <div className="mb-5">
        <Input
          type="text"
          placeholder="Search jobs (Backend, React, Node...)"
          value={keyword}
          onChange={(e) => {
            setKeyword(e.target.value);
            setHasSearched(e.target.value.trim() !== "");
          }}
          className="max-w-md"
        />
      </div>

      <div className="flex gap-5">
        <div className="w-[20%]">
          <FilterCard />
        </div>

        <div className="flex-1 h-[88vh] overflow-y-auto pb-5">
          {loading && (
            <div className="text-center text-gray-500 mb-4">
              Analyzing your fit...
            </div>
          )}

          {hasSearched && filteredJobs.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-500 text-lg">
              No such jobs available
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredJobs.map((job) => (
                <Job key={job._id} job={job} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Jobs;
