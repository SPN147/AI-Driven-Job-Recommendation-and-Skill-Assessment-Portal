import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import isRecruiter from "../middlewares/isRecruiter.js";
import {
  applyJob,
  getApplicants,
  getAppliedJobs,
  updateStatus,
} from "../controllers/application.controller.js";

const router = express.Router();

/**
 * ================================
 * Student Routes
 * ================================
 */

// Student applies for a job
router.post("/apply/:id", isAuthenticated, applyJob);

// Student gets their applied jobs
router.get("/get", isAuthenticated, getAppliedJobs);

/**
 * ================================
 * Recruiter Routes
 * ================================
 */

// Recruiter views applicants for a job
router.get(
  "/:id/applicants",
  isAuthenticated,
  isRecruiter,
  getApplicants
);

// Recruiter updates application status
router.post(
  "/status/:id/update",
  isAuthenticated,
  isRecruiter,
  updateStatus
);

export default router;


/*import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js"
import { applyJob, getApplicants, getAppliedJobs, updateStatus } from "../controllers/application.controller.js";

const router = express.Router();

router.route("/apply/:id").post(isAuthenticated,applyJob);

// only after authentication we can get the applied jobs.
router.route("/get").get(isAuthenticated,getAppliedJobs);
router.route("/:id/applicants").get(isAuthenticated,getApplicants);
router.route("/status/:id/update").post(isAuthenticated,updateStatus);

export default router; */