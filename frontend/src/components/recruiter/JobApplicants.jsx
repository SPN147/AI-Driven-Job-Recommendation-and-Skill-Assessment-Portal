import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import toast from "react-hot-toast";

import { APPLICATION_JOB_API_END_POINT } from "@/utils/constant";
import { setSingleJob } from "@/redux/jobSlice";

const JobApplicants = () => {
  const { jobId } = useParams();
  const dispatch = useDispatch();
  const { singleJob } = useSelector((store) => store.job);

  // ================================
  // Fetch applicants (RECRUITER)
  // ================================
  const fetchApplicants = async () => {
    try {
      const res = await axios.get(
        `${APPLICATION_JOB_API_END_POINT}/${jobId}/applicants`,
        { withCredentials: true }
      );

      if (res.data.success) {
        dispatch(setSingleJob(res.data.job));
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch applicants");
    }
  };

  useEffect(() => {
    if (jobId) {
      fetchApplicants();
    }
  }, [jobId]);

  // Prevent crash while loading
  if (!singleJob) {
    return (
      <div className="text-center mt-20 text-gray-500">
        Loading applicants...
      </div>
    );
  }

  // ================================
  // Update application status
  // ================================
  const updateStatus = async (applicationId, status) => {
    try {
      const res = await axios.post(
        `${APPLICATION_JOB_API_END_POINT}/status/${applicationId}/update`,
        { status },
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success(`Application ${status}`);
        fetchApplicants(); // refresh applicants
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-10 px-4">
      <h1 className="text-2xl font-bold mb-6">
        Applicants for {singleJob.title}
      </h1>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {singleJob.applications.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-gray-500">
                No applicants yet
              </TableCell>
            </TableRow>
          ) : (
            singleJob.applications.map((app) => (
              <TableRow key={app._id}>
                <TableCell>{app.applicant?.fullname}</TableCell>
                <TableCell>{app.applicant?.email}</TableCell>

                <TableCell>
                  <Badge
                    className={
                      app.status === "accepted"
                        ? "bg-green-600"
                        : app.status === "rejected"
                        ? "bg-red-600"
                        : "bg-yellow-500"
                    }
                  >
                    {app.status}
                  </Badge>
                </TableCell>

                <TableCell className="flex gap-2">
                  <Button
                    size="sm"
                    disabled={app.status !== "pending"}
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => updateStatus(app._id, "accepted")}
                  >
                    Accept
                  </Button>

                  <Button
                    size="sm"
                    disabled={app.status !== "pending"}
                    className="bg-red-600 hover:bg-red-700"
                    onClick={() => updateStatus(app._id, "rejected")}
                  >
                    Reject
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default JobApplicants;
