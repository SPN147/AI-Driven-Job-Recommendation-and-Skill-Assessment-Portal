import { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setRecruiterJobs } from "@/redux/jobSlice"; // ✅ FIX
import { JOB_API_END_POINT } from "@/utils/constant";

const useGetRecruiterJobs = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchRecruiterJobs = async () => {
      try {
        const res = await axios.get(
          `${JOB_API_END_POINT}/recruiter/jobs`,
          { withCredentials: true }
        );

        if (res.data.success) {
          dispatch(setRecruiterJobs(res.data.jobs)); // ✅ FIX
        } else {
          dispatch(setRecruiterJobs([]));
        }
      } catch (error) {
        console.error("Recruiter jobs fetch error:", error);
        dispatch(setRecruiterJobs([]));
      }
    };

    fetchRecruiterJobs();
  }, [dispatch]);
};

export default useGetRecruiterJobs;
