import { createSlice } from "@reduxjs/toolkit";

const jobSlice = createSlice({
  name: "job",
  initialState: {
    allJobs: [],        // student jobs
    singleJob: null,
    appliedJobs: [],    // student applied jobs
    recruiterJobs: [],  // ✅ recruiter jobs (ADD)
  },
  reducers: {
    setAllJobs: (state, action) => {
      state.allJobs = action.payload;
    },
    setSingleJob: (state, action) => {
      state.singleJob = action.payload;
    },
    setAppliedJobs: (state, action) => {
      state.appliedJobs = action.payload;
    },
    setRecruiterJobs: (state, action) => {
      state.recruiterJobs = action.payload; // ✅ ADD
    },
  },
});

export const {
  setAllJobs,
  setSingleJob,
  setAppliedJobs,
  setRecruiterJobs, // ✅ EXPORT
} = jobSlice.actions;

export default jobSlice.reducer;
