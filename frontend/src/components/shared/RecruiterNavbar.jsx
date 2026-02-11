import { NavLink, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  LayoutDashboard,
  Briefcase,
  PlusCircle,
  LogOut,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { setUser } from "@/redux/authSlice";
import toast from "react-hot-toast";

const RecruiterNavbar = () => {
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = async () => {
    try {
      await axios.get(`${USER_API_END_POINT}/logout`, {
        withCredentials: true,
      });
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Logout failed, clearing session");
    } finally {
      dispatch(setUser(null));
      navigate("/");
    }
  };

  const navLinkBase =
    "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all";

  const navLinkActive =
    "bg-[#6A38C2] text-white shadow-sm";

  const navLinkInactive =
    "text-gray-600 hover:bg-gray-100";

  return (
    <header className="sticky top-0 z-50 bg-white border-b">
      <div className="max-w-7xl mx-auto px-6">
        <div className="h-16 flex items-center justify-between">

          {/* LOGO */}
          <div
            onClick={() => navigate("/recruiter/dashboard")}
            className="cursor-pointer text-2xl font-extrabold tracking-tight"
          >
            Job <span className="text-[#d20d0d]">Nova</span>
          </div>

          {/* NAV LINKS */}
          <nav className="flex items-center gap-3">

            <NavLink
              to="/recruiter/dashboard"
              className={({ isActive }) =>
                `${navLinkBase} ${
                  isActive ? navLinkActive : navLinkInactive
                }`
              }
            >
              <LayoutDashboard size={18} />
              Dashboard
            </NavLink>

            <NavLink
              to="/recruiter/jobs"
              className={({ isActive }) =>
                `${navLinkBase} ${
                  isActive ? navLinkActive : navLinkInactive
                }`
              }
            >
              <Briefcase size={18} />
              My Jobs
            </NavLink>

            <NavLink
              to="/recruiter/post-job"
              className={({ isActive }) =>
                `${navLinkBase} ${
                  isActive ? navLinkActive : navLinkInactive
                }`
              }
            >
              <PlusCircle size={18} />
              Post Job
            </NavLink>

            {/* DIVIDER */}
            <div className="h-6 w-px bg-gray-200 mx-2" />

            {/* PROFILE AVATAR */}
            <NavLink to="/recruiter/profile">
              <Avatar className="h-9 w-9 border cursor-pointer hover:scale-105 transition">
                <AvatarImage src={user?.profile?.profilePhoto} />
                <AvatarFallback className="bg-[#6A38C2] text-white font-semibold">
                  {user?.fullname?.charAt(0)?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </NavLink>

            {/* LOGOUT */}
            <Button
              variant="ghost"
              size="icon"
              onClick={logoutHandler}
              className="text-gray-600 hover:text-red-600"
              title="Logout"
            >
              <LogOut size={18} />
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default RecruiterNavbar;
