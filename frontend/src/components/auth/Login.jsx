import React, { useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { RadioGroup } from "../ui/radio-group";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";
import { USER_API_END_POINT } from "../../utils/constant";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setUser } from "@/redux/authSlice";
import { Loader2 } from "lucide-react";

// illustration
import loginIllustration from "../../assets/login-pana.svg";

const Login = () => {
  const { loading } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [input, setInput] = useState({
    email: "",
    password: "",
    role: "",
  });

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!input.email || !input.password || !input.role) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      dispatch(setLoading(true));

      const res = await axios.post(
        `${USER_API_END_POINT}/login`,
        input,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // ✅ STORE ONLY USER OBJECT IN REDUX
      dispatch(setUser(res.data.user));

      toast.success("Login successful");

      // optional role-based redirect
      if (res.data.user.role === "recruiter") {
        navigate("/recruiter/dashboard");
      } else {
        navigate("/");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-gradient-to-b from-white to-[#f6f3ff] px-6">
      <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-10 items-center">

        {/* LEFT - LOGIN FORM */}
        <form
          onSubmit={submitHandler}
          className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md mx-auto"
        >
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
              Welcome Back 👋
            </h1>
            <p className="text-sm text-gray-500">
              Login to continue your career journey
            </p>
          </div>

          <div className="mb-4">
            <Label>Email</Label>
            <Input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={input.email}
              onChange={changeEventHandler}
            />
          </div>

          <div className="mb-4">
            <Label>Password</Label>
            <Input
              type="password"
              name="password"
              placeholder="••••••••"
              value={input.password}
              onChange={changeEventHandler}
            />
          </div>

          <div className="mb-6">
            <Label className="block mb-2">Login as</Label>
            <RadioGroup className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value="student"
                  checked={input.role === "student"}
                  onChange={changeEventHandler}
                />
                <span className="text-sm">Student</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value="recruiter"
                  checked={input.role === "recruiter"}
                  onChange={changeEventHandler}
                />
                <span className="text-sm">Recruiter</span>
              </label>
            </RadioGroup>
          </div>

          <Button
            type="submit"
            className="w-full bg-[#6a38c2] hover:bg-[#5b2fb3]"
          >
            {loading ? <Loader2 className="animate-spin" /> : "Login"}
          </Button>

          <p className="text-sm text-center mt-5 text-gray-600">
            Don’t have an account?{" "}
            <Link to="/signup" className="text-[rgb(106,56,194)] font-medium">
              Signup
            </Link>
          </p>
        </form>

        {/* RIGHT - ILLUSTRATION */}
        <div className="hidden md:flex justify-center">
          <img
            src={loginIllustration}
            alt="Login illustration"
            className="w-[90%] max-w-md animate-float"
          />
        </div>

      </div>
    </div>
  );
};

export default Login;
