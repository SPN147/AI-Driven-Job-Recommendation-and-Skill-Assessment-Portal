import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";

import RecruiterNavbar from "./RecruiterNavbar";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui/avatar";
import { PopoverClose } from "@radix-ui/react-popover";

import {
  LogOut,
  User2,
  ClipboardList,
  BarChart3,
  Home as HomeIcon,
  Briefcase,
  Search,
} from "lucide-react";

import { USER_API_END_POINT } from "@/utils/constant";
import { setUser } from "@/redux/authSlice";

const Navbar = () => {
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  /* ================================
     🔁 RECRUITER NAVBAR SWITCH
  ================================= */
  if (user?.role === "recruiter") {
    return <RecruiterNavbar />;
  }

  /* ================================
     LOGOUT HANDLER
  ================================= */
  const logoutHandler = async () => {
    try {
      const res = await axios.get(`${USER_API_END_POINT}/logout`, {
        withCredentials: true,
      });

      if (res.data.success) {
        dispatch(setUser(null));
        toast.success(res.data.message);
        navigate("/");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Logout failed");
    }
  };

  const navItemClass =
    "flex items-center gap-1 px-3 py-1.5 rounded-md hover:bg-gray-100 transition";

  /* ================================
     STUDENT / PUBLIC NAVBAR
  ================================= */
  return (
    <header className="sticky top-0 z-50 bg-white border-b">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between">
          
          {/* LOGO */}
          <Link to="/" className="text-2xl font-bold tracking-tight">
            Job <span className="text-[#F83002]">Nova</span>
          </Link>

          {/* NAV LINKS */}
          <nav className="flex items-center gap-8">
            <ul className="flex items-center gap-4 text-sm font-medium text-gray-700">
              <li>
                <NavLink to="/" className={navItemClass}>
                  <HomeIcon size={16} />
                  Home
                </NavLink>
              </li>

              <li>
                <NavLink to="/jobs" className={navItemClass}>
                  <Briefcase size={16} />
                  Jobs
                </NavLink>
              </li>

              <li>
                <NavLink to="/browse" className={navItemClass}>
                  <Search size={16} />
                  Browse
                </NavLink>
              </li>

              {user && (
                <>
                  <li>
                    <NavLink to="/assessment" className={navItemClass}>
                      <ClipboardList size={16} />
                      Skill Test
                    </NavLink>
                  </li>

                  <li>
                    <NavLink to="/test-results" className={navItemClass}>
                      <BarChart3 size={16} />
                      Results
                    </NavLink>
                  </li>
                </>
              )}
            </ul>

            {/* AUTH SECTION */}
            {!user ? (
              <div className="flex items-center gap-3">
                <Link to="/login">
                  <Button variant="outline">Login</Button>
                </Link>
                <Link to="/signup">
                  <Button className="bg-[#6A38C2] hover:bg-[#5118b3]">
                    Sign Up
                  </Button>
                </Link>
              </div>
            ) : (
              <Popover>
                <PopoverTrigger asChild>
                  <Avatar className="cursor-pointer">
                    <AvatarImage
                      src={user?.profile?.profilePhoto}
                      alt="profile"
                    />
                    <AvatarFallback className="bg-[#6A38C2] text-white font-semibold">
                      {user?.fullName?.charAt(0)?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </PopoverTrigger>

                <PopoverContent className="w-72">
                  <div className="flex gap-4 items-center">
                    <Avatar>
                      <AvatarImage
                        src={user?.profile?.profilePhoto}
                        alt="profile"
                      />
                      <AvatarFallback className="bg-[#6A38C2] text-white font-semibold">
                        {user?.fullName?.charAt(0)?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <div>
                      <h4 className="font-medium">
                        {user?.fullName || "User"}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {user?.profile?.bio || "No bio available"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-col gap-2">
                    <PopoverClose asChild>
                      <Link to="/profile">
                        <Button
                          variant="ghost"
                          className="justify-start gap-2"
                        >
                          <User2 size={16} />
                          View Profile
                        </Button>
                      </Link>
                    </PopoverClose>

                    <PopoverClose asChild>
                      <Button
                        onClick={logoutHandler}
                        variant="ghost"
                        className="justify-start gap-2 text-red-600"
                      >
                        <LogOut size={16} />
                        Logout
                      </Button>
                    </PopoverClose>
                  </div>
                </PopoverContent>
              </Popover>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
