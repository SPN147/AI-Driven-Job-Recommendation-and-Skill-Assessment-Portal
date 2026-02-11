import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Badge } from "./ui/badge";
import { useSelector } from "react-redux";
import useGetAppliedJobs from "../hooks/useGetAppliedJobs";

const AppliedJobTable = () => {
  // ✅ Fetch applied jobs ONCE via hook
  useGetAppliedJobs();

  const { appliedJobs } = useSelector((store) => store.job);

  return (
    <div className="mt-6">
      <Table>
        <TableCaption>Your applied jobs</TableCaption>

        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Job Role</TableHead>
            <TableHead>Company</TableHead>
            <TableHead className="text-right">Status</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {appliedJobs.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={4}
                className="text-center text-gray-500 py-6"
              >
                You have not applied to any jobs yet
              </TableCell>
            </TableRow>
          ) : (
            appliedJobs.map((application) => (
              <TableRow key={application._id}>
                <TableCell>
                  {application.createdAt?.split("T")[0]}
                </TableCell>
                <TableCell>
                  {application.job?.title || "N/A"}
                </TableCell>
                <TableCell>
                  {application.job?.company?.name || "N/A"}
                </TableCell>
                <TableCell className="text-right">
                  <Badge
                    className={
                      application.status === "accepted"
                        ? "bg-green-600"
                        : application.status === "rejected"
                        ? "bg-red-600"
                        : "bg-yellow-500"
                    }
                  >
                    {application.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default AppliedJobTable;
