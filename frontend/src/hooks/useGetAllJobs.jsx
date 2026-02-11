import { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setAllJobs } from "../redux/jobSlice";
import { JOB_API_END_POINT } from "../utils/constant";

const useGetAllJobs = (keyword = "") => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchAllJobs = async () => {
      try {
        const res = await axios.get(
          `${JOB_API_END_POINT}/get?keyword=${keyword}`,
          { withCredentials: true }
        );

        if (res.data.success) {
          dispatch(setAllJobs(res.data.jobs));
        } else {
          // 🔹 important for "No jobs found" UI
          dispatch(setAllJobs([]));
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
        dispatch(setAllJobs([])); // 🔹 clears list on error
      }
    };

    fetchAllJobs();
  }, [dispatch, keyword]);
};

export default useGetAllJobs;
