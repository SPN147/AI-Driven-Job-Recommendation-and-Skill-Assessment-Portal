import { Bookmark } from "lucide-react";
import React from "react";
import { Button } from "./ui/button";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { Badge } from "./ui/badge";
import { useNavigate } from "react-router-dom";

const Job = ({ job }) => {
  const navigate = useNavigate();

  const daysAgoFunction = (mongodbTime) => {
    const createdAt = new Date(mongodbTime);
    const currentTime = new Date();
    const timeDifference = currentTime - createdAt;
    return Math.floor(timeDifference / (1000 * 24 * 60 * 60));
  };

  const percentage =
    job?.score !== undefined
      ? Math.round(job.score * 100)
      : null;

  return (
    <div className="p-5 rounded-md shadow-xl bg-white border border-gray-100">

      {/* TOP SECTION */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          {daysAgoFunction(job?.createdAt) === 0
            ? "Today"
            : `${daysAgoFunction(job?.createdAt)} days ago`}
        </p>

        <div className="flex items-center gap-3">
          {percentage !== null && (
            <span
              className={`font-bold text-sm ${
                percentage >= 50
                  ? "text-green-600"
                  : percentage > 0
                  ? "text-yellow-600"
                  : "text-red-500"
              }`}
            >
              {percentage}% Match
            </span>
          )}

          <Button variant="outline" className="rounded-full" size="icon">
            <Bookmark />
          </Button>
        </div>
      </div>

      {/* COMPANY */}
      <div className="flex items-center gap-2 my-2">
        <Button>
          <Avatar className="w-9 h-15">
            <AvatarImage src="https://freedesignfile.com/upload/2015/02/Colored-company-logos-creative-design-05.jpg" />
          </Avatar>
        </Button>
        <div>
          <h1 className="font-medium text-lg">{job?.company?.name}</h1>
          <p className="text-sm text-gray-500">India</p>
        </div>
      </div>

      {/* JOB INFO */}
      <div>
        <h1 className="font-bold text-lg my-2">{job?.title}</h1>
        <p className="text-sm text-gray-600">{job?.description}</p>
      </div>

      {/* BADGES */}
      <div className="flex items-center gap-2 mt-4">
        <Badge className="text-blue-700 font-bold" variant="ghost">
          {job?.position} Positions
        </Badge>
        <Badge className="text-[#f83002] font-bold" variant="ghost">
          {job?.jobType}
        </Badge>
        <Badge className="text-[#7209b7] font-bold" variant="ghost">
          {job?.salary} LPA
        </Badge>
      </div>

      {/* BUTTONS */}
      <div className="flex items-center gap-4 mt-4">
        <Button
          onClick={() => navigate(`/description/${job?._id}`)}
          variant="outline"
        >
          Details
        </Button>

        <Button className="text-[#f4f2f5]">
          Save for Later
        </Button>
      </div>
    </div>
  );
};

export default Job;
