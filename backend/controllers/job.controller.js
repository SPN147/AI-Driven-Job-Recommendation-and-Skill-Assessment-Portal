import { Job } from "../models/job.model.js";
import { User } from "../models/user.model.js";

/* ================================
   Recruiter: Post job (AUTO COMPANY)
================================ */
export const postJob = async (req, res) => {
  try {
    // 🔐 recruiter-only check
    if (req.user.role !== "recruiter") {
      return res.status(403).json({
        message: "Only recruiters can post jobs",
        success: false,
      });
    }

    // 🔎 Get recruiter with company
    const recruiter = await User.findById(req.user._id);

    if (!recruiter.profile.company) {
      return res.status(400).json({
        message: "Please complete recruiter profile before posting jobs",
        success: false,
      });
    }

    const {
      title,
      description,
      requirements,
      salary,
      location,
      jobType,
      experience,
      position,
    } = req.body;

    if (
      !title ||
      !description ||
      !requirements ||
      !salary ||
      !location ||
      !jobType ||
      !experience ||
      !position
    ) {
      return res.status(400).json({
        message: "Something is missing.",
        success: false,
      });
    }

    const job = await Job.create({
      title,
      description,
      requirement: requirements.split(",").map((r) => r.trim()),
      salary: Number(salary),
      location,
      jobType,
      experienceLevel: Number(experience),
      position: Number(position),
      company: recruiter.profile.company, // ✅ AUTO ATTACHED
      created_by: recruiter._id,
    });

    return res.status(201).json({
      message: "New job created successfully.",
      job,
      success: true,
    });
  } catch (error) {
    console.error("❌ postJob error:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

/* ================================
   Student: Get all jobs (SEARCH SAFE)
================================ */
export const getAllJobs = async (req, res) => {
  try {
    const keyword = req.query.keyword?.trim() || "";
    let query = {};

    // 🔍 Search in title or description if keyword exists
    if (keyword) {
      query = {
        $or: [
          { title: { $regex: keyword, $options: "i" } },
          { description: { $regex: keyword, $options: "i" } },
        ],
      };
    }

    const jobs = await Job.find(query)
      .populate("company")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      jobs,
    });
  } catch (error) {
    console.error("❌ getAllJobs error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch jobs",
    });
  }
};

/* ================================
   Student: Get job by ID
================================ */
export const getJobById = async (req, res) => {
  try {
    const jobId = req.params.id;

    const job = await Job.findById(jobId).populate("company");

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
        success: false,
      });
    }

    return res.status(200).json({
      job,
      success: true,
    });
  } catch (error) {
    console.error("❌ getJobById error:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

/* ================================
   Recruiter: Get own jobs
================================ */
export const getRecruiterJobs = async (req, res) => {
  try {
    if (req.user.role !== "recruiter") {
      return res.status(403).json({
        message: "Recruiter access only",
        success: false,
      });
    }

    const recruiterId = req.user._id;

    const jobs = await Job.find({ created_by: recruiterId })
      .populate("company")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      jobs,
      success: true,
    });
  } catch (error) {
    console.error("❌ getRecruiterJobs error:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};
