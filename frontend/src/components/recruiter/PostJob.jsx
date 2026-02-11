import React, { useState } from "react";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import axios from "axios";
import toast from "react-hot-toast";
import { JOB_API_END_POINT } from "@/utils/constant";
import { useNavigate } from "react-router-dom";

const PostJob = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    requirements: "",
    salary: "",
    location: "",
    jobType: "",
    experience: "",
    position: "",
  });

  // ================================
  // Handle input changes
  // ================================
  const changeHandler = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // ================================
  // Submit job
  // ================================
  const submitHandler = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await axios.post(
        `${JOB_API_END_POINT}/post`,
        formData,
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success("Job posted successfully");
        navigate("/recruiter/jobs");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to post job");
    } finally {
      setSubmitting(false);
    }
  };

  // ================================
  // UI
  // ================================
  return (
    <div className="max-w-3xl mx-auto my-10 bg-white p-8 rounded-xl shadow">
      <h1 className="text-2xl font-bold mb-6">Post a Job</h1>

      <form onSubmit={submitHandler} className="space-y-4">
        <div>
          <Label>Job Title</Label>
          <Input
            name="title"
            value={formData.title}
            onChange={changeHandler}
            required
          />
        </div>

        <div>
          <Label>Description</Label>
          <Textarea
            name="description"
            value={formData.description}
            onChange={changeHandler}
            required
          />
        </div>

        <div>
          <Label>Requirements (comma separated)</Label>
          <Input
            name="requirements"
            value={formData.requirements}
            onChange={changeHandler}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Salary</Label>
            <Input
              name="salary"
              type="number"
              value={formData.salary}
              onChange={changeHandler}
              required
            />
          </div>

          <div>
            <Label>Experience (years)</Label>
            <Input
              name="experience"
              type="number"
              value={formData.experience}
              onChange={changeHandler}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Job Type</Label>
            <Input
              name="jobType"
              value={formData.jobType}
              onChange={changeHandler}
              required
            />
          </div>

          <div>
            <Label>Positions</Label>
            <Input
              name="position"
              type="number"
              value={formData.position}
              onChange={changeHandler}
              required
            />
          </div>
        </div>

        <div>
          <Label>Location</Label>
          <Input
            name="location"
            value={formData.location}
            onChange={changeHandler}
            required
          />
        </div>

        <Button
          type="submit"
          disabled={submitting}
          className="w-full bg-[#6A38C2] hover:bg-[#5b2fb3]"
        >
          {submitting ? "Posting..." : "Post Job"}
        </Button>
      </form>
    </div>
  );
};

export default PostJob;
