import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { USER_API_END_POINT } from "@/utils/constant";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/redux/authSlice";

const EditRecruiterProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth);

  const [loading, setLoading] = useState(false);

  // ✅ ADDED description
  const [formData, setFormData] = useState({
    bio: "",
    companyName: "",
    description: "",     // 🔥 REQUIRED BY BACKEND
    website: "",
    location: "",
  });

  // ================================
  // Prefill existing data
  // ================================
  useEffect(() => {
    if (user) {
      setFormData({
        bio: user.profile?.bio || "",
        companyName: user.profile?.company?.name || "",
        description: user.profile?.company?.description || "",
        website: user.profile?.company?.website || "",
        location: user.profile?.company?.location || "",
      });
    }
  }, [user]);

  // ================================
  // Handle input change
  // ================================
  const changeHandler = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // ================================
  // Submit recruiter profile update
  // ================================
  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.put(
        `${USER_API_END_POINT}/recruiter/profile`,
        JSON.stringify(formData),
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (res.data.success) {
        dispatch(setUser(res.data.user));
        toast.success("Recruiter profile updated");
        navigate("/recruiter/profile");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to update recruiter profile"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto my-10 bg-white p-8 rounded-xl shadow">
      <h1 className="text-2xl font-bold mb-6">
        Edit Company & Recruiter Details
      </h1>

      <form onSubmit={submitHandler} className="space-y-4">
        <div>
          <Label>Company Name</Label>
          <Input
            name="companyName"
            value={formData.companyName}
            onChange={changeHandler}
            required
          />
        </div>

        {/* ✅ NEW FIELD */}
        <div>
          <Label>Company Description</Label>
          <Input
            name="description"
            value={formData.description}
            onChange={changeHandler}
            required
          />
        </div>

        <div>
          <Label>Website</Label>
          <Input
            name="website"
            value={formData.website}
            onChange={changeHandler}
          />
        </div>

        <div>
          <Label>Location</Label>
          <Input
            name="location"
            value={formData.location}
            onChange={changeHandler}
          />
        </div>

        <div>
          <Label>Recruiter Bio</Label>
          <Input
            name="bio"
            value={formData.bio}
            onChange={changeHandler}
          />
        </div>

        <div className="flex gap-4">
          <Button
            type="submit"
            disabled={loading}
            className="bg-[#6A38C2] hover:bg-[#5b2fb3]"
          >
            {loading ? "Saving..." : "Save Changes"}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/recruiter/profile")}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditRecruiterProfile;
