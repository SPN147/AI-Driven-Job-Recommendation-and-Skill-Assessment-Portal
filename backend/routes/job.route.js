import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import isRecruiter from "../middlewares/isRecruiter.js";
import {
  postJob,
  getAllJobs,
  getJobById,
  getRecruiterJobs,
} from "../controllers/job.controller.js";

const router = express.Router();

/**
 * ================================
 * Recruiter Routes
 * ================================
 */

// Recruiter posts a job
router.post(
  "/post",
  isAuthenticated,
  isRecruiter,
  postJob
);

// Recruiter gets ONLY their jobs
router.get(
  "/recruiter/jobs",
  isAuthenticated,
  isRecruiter,
  getRecruiterJobs
);

/**
 * ================================
 * Student / Public Routes
 * ================================
 */

// Get all jobs (students don't need login)
router.get("/get", getAllJobs);

// Get job by ID
router.get("/get/:id", getJobById);

export default router;

/*import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import {getAdminJobs, getAllJobs, getJobById, postJob} from "../controllers/job.controller.js";

const router = express.Router();

// Since only authenticated users(recruiters) can post the job we use .post(isAuthenticated)
// So in postman testing first test login api of recruiter 
// and only then we can post job.

router.route("/post").post(isAuthenticated,postJob);

// get jobs posted by recuiter.
router.route("/get").get(isAuthenticated,getAllJobs);
router.route("/getadminjobs").get(isAuthenticated,getAdminJobs);
router.route("/get/:id").get(isAuthenticated,getJobById);


export default router; */