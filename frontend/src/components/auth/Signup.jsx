import React, { useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { RadioGroup } from "../ui/radio-group";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router-dom";
import { USER_API_END_POINT } from "../../utils/constant";
import { toast } from "sonner";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "@/redux/authSlice";
import { Loader2 } from "lucide-react";

// ✅ illustration
import signupIllustration from "../../assets/signup-illustration.svg";

const Signup = () => {
  const [input, setInput] = useState({
    fullname: "",
    email: "",
    phoneNumber: "",
    role: "",
    password: "",
    file: null,
  });

  const { loading } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const changeFileHandler = (e) => {
    setInput({ ...input, file: e.target.files?.[0] });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("fullname", input.fullname);
    formData.append("email", input.email);
    formData.append("phoneNumber", input.phoneNumber);
    formData.append("password", input.password);
    formData.append("role", input.role);
    if (input.file) formData.append("file", input.file);

    try {
      dispatch(setLoading(true));
      const res = await axios.post(
        `${USER_API_END_POINT}/register`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/login");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Registration failed"
      );
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-gradient-to-b from-white to-[#f6f3ff] px-6">
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-10 items-center">

        {/* LEFT - FORM */}
        <form
          onSubmit={submitHandler}
          className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md mx-auto"
        >
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
              Create your account 🚀
            </h1>
            <p className="text-sm text-gray-500">
              Start your AI-powered career journey
            </p>
          </div>

          <div className="mb-3">
            <Label>Full Name</Label>
            <Input
              type="text"
              name="fullname"
              value={input.fullname}
              onChange={changeEventHandler}
              placeholder="Ram Prasad"
            />
          </div>

          <div className="mb-3">
            <Label>Email</Label>
            <Input
              type="email"
              name="email"
              value={input.email}
              onChange={changeEventHandler}
              placeholder="ramprasad@gmail.com"
            />
          </div>

          <div className="mb-3">
            <Label>Phone Number</Label>
            <Input
              type="text"
              name="phoneNumber"
              value={input.phoneNumber}
              onChange={changeEventHandler}
              placeholder="1234567890"
            />
          </div>

          <div className="mb-3">
            <Label>Password</Label>
            <Input
              type="password"
              name="password"
              value={input.password}
              onChange={changeEventHandler}
              placeholder="Enter your password"
            />
          </div>

          {/* ROLE + PROFILE */}
          <div className="flex flex-col gap-4 my-4">
            <div>
              <Label className="mb-2 block">Register as</Label>
              <RadioGroup className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <Input
                    type="radio"
                    name="role"
                    value="student"
                    checked={input.role === "student"}
                    onChange={changeEventHandler}
                  />
                  <span className="text-sm">Student</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <Input
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

            <div>
              <Label>Profile Image</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={changeFileHandler}
                className="cursor-pointer"
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-[#6A38C2] hover:bg-[#5b2fb3]"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </>
            ) : (
              "Sign Up"
            )}
          </Button>

          <p className="text-sm text-center mt-5 text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-[#6A38C2] font-medium">
              Login
            </Link>
          </p>
        </form>

        {/* RIGHT - ILLUSTRATION */}
        <div className="hidden md:flex justify-center">
          <img
            src={signupIllustration}
            alt="Signup illustration"
            className="w-[90%] max-w-md animate-float"
          />
        </div>
      </div>
    </div>
  );
};

export default Signup;
