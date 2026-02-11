/*import { useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setAppliedJobs } from "@/redux/jobSlice";

const useGetAppliedJobs = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8000/api/v1/application/get",
          { withCredentials: true }
        );

        if (res.data?.success && Array.isArray(res.data.application)) {
          dispatch(setAppliedJobs(res.data.application));
        } else {
          // ✅ ALWAYS send array
          dispatch(setAppliedJobs([]));
        }
      } catch (error) {
        console.log("❌ Failed to fetch applied jobs", error);
        dispatch(setAppliedJobs([])); // ✅ safety fallback
      }
    };

    fetchAppliedJobs();
  }, [dispatch]);
};

export default useGetAppliedJobs; */

import { useEffect, useRef } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setAppliedJobs } from "../redux/jobSlice";
import { APPLICATION_JOB_API_END_POINT } from "../utils/constant";

const useGetAppliedJobs = () => {
  const dispatch = useDispatch();
  const fetchedRef = useRef(false);

  useEffect(() => {
    // 🔒 Prevent double fetch in React 18 StrictMode
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    const fetchAppliedJobs = async () => {
      try {
        const res = await axios.get(
          `${APPLICATION_JOB_API_END_POINT}/get`,
          { withCredentials: true }
        );

        if (res.data?.success && Array.isArray(res.data.applications)) {
          dispatch(setAppliedJobs(res.data.applications));
        } else {
          dispatch(setAppliedJobs([]));
        }
      } catch (error) {
        console.error("Applied jobs fetch error:", error);
        dispatch(setAppliedJobs([]));
      }
    };

    fetchAppliedJobs();
  }, [dispatch]);
};

export default useGetAppliedJobs;
