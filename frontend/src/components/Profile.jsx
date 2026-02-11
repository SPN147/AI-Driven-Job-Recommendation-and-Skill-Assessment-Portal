import React, { useState } from "react";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Contact, Mail, Pen } from "lucide-react";
import { Label } from "./ui/label";
import AppliedJobTable from "./AppliedJobTable";
import UpdateProfileDialog from "./UpdateProfileDialog";
import { useSelector } from "react-redux";

const Profile = () => {
  const [open, setOpen] = useState(false);

  const { user } = useSelector((store) => store.auth);

  const hasResume = Boolean(user?.profile?.resumeOriginalName);

  return (
    <div className="pb-10">
      {/* ================= PROFILE CARD ================= */}
      <div className="max-w-4xl mx-auto bg-white border border-gray-200 rounded-2xl my-6 p-8">
        <div className="flex justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-24 w-24">
              <AvatarImage
                src={user?.profile?.profilePhoto}
                alt="profile"
              />
            </Avatar>

            <div>
              <h1 className="font-medium text-xl">
                {user?.fullName || user?.fullname}
              </h1>
              <p className="text-gray-600">
                {user?.profile?.bio || "No bio added"}
              </p>
            </div>
          </div>

          <Button onClick={() => setOpen(true)} variant="outline">
            <Pen />
          </Button>
        </div>

        {/* ================= CONTACT ================= */}
        <div className="my-5">
          <div className="flex items-center gap-3 my-2">
            <Mail />
            <span>{user?.email}</span>
          </div>

          <div className="flex items-center gap-3">
            <Contact />
            <span>{user?.phoneNumber}</span>
          </div>
        </div>

        {/* ================= SKILLS ================= */}
        <div className="my-5">
          <h1 className="font-semibold mb-2">Skills</h1>

          <div className="flex flex-wrap gap-2">
            {user?.profile?.skills?.length > 0 ? (
              user.profile.skills.slice(0, 15).map((skill, index) => (
                <Badge key={index}>{skill}</Badge>
              ))
            ) : (
              <span className="text-gray-500">N.A</span>
            )}
          </div>

          {user?.profile?.skills?.length > 0 && (
            <p className="text-xs text-gray-400 mt-2">
              Skills extracted using resume parsing (ML)
            </p>
          )}
        </div>

        {/* ================= RESUME ================= */}
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label className="text-md font-bold">Resume</Label>
          {hasResume ? (
            <span className="text-gray-700">
              {user.profile.resumeOriginalName}
            </span>
          ) : (
            <span className="text-gray-500">N.A</span>
          )}
        </div>
      </div>

      {/* ================= APPLIED JOBS ================= */}
      <div className="max-w-4xl mx-auto bg-white border border-gray-200 rounded-2xl my-10 p-6">
        <h1 className="font-bold text-lg mb-4">Applied Jobs</h1>
        <AppliedJobTable />
      </div>

      {/* ================= UPDATE PROFILE MODAL ================= */}
      <UpdateProfileDialog open={open} setOpen={setOpen} />
    </div>
  );
};

export default Profile;
