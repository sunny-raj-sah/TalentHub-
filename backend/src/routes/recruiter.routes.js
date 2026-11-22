import express from "express";

import {
      getDashboard,
  getRecruiterJobs,
} from "../controllers/recruiter.controller.js";

import { protect } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";

const router = express.Router();

// All recruiter routes require recruiter authentication.
router.use(protect, authorize("RECRUITER"));

// GET recruiter dashboard
router.get("/dashboard", getDashboard);

// GET recruiter's own jobs
router.get("/jobs", getRecruiterJobs);

export default router;