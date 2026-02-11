import { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { APPLICATION_JOB_API_END_POINT } from "@/utils/constant";
import { setApplicants } from "@/redux/jobSlice";

const useGetApplicants = (jobId) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!jobId) return;

    const fetchApplicants = async () => {
      try {
        const res = await axios.get(
          `${APPLICATION_JOB_API_END_POINT}/${jobId}/applicants`,
          { withCredentials: true }
        );

        if (res.data.success) {
          dispatch(setApplicants(res.data.applications));
        } else {
          dispatch(setApplicants([]));
        }
      } catch (error) {
        console.error(
          "Failed to fetch applicants:",
          error.response?.data || error.message
        );
        dispatch(setApplicants([]));
      }
    };

    fetchApplicants();
  }, [dispatch, jobId]);
};

export default useGetApplicants;
