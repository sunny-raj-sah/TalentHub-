 

import express from "express";

import {
  createJob,
  updateJob,
  archiveJob,
  restoreJob,
  deleteJob,
  getJobById,
  getJobs,
  getFeaturedJobs,
  getRecentJobs,
  getSimilarJobs,
} from "../controllers/job.controller.js";

import { protect } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";

const router = express.Router();

// Public job discovery.
router.get("/", getJobs);
router.get("/featured", getFeaturedJobs);
router.get("/recent", getRecentJobs);
router.get("/:id", getJobById);
router.get("/:id/similar", getSimilarJobs);

// Recruiter-only job management.
router.post(
  "/",
  protect,
  authorize("RECRUITER"),
  createJob
);

router.put(
  "/:id",
  protect,
  authorize("RECRUITER"),
  updateJob
);

router.patch(
  "/:id/archive",
  protect,
  authorize("RECRUITER"),
  archiveJob
);

router.patch(
  "/:id/restore",
  protect,
  authorize("RECRUITER"),
  restoreJob
);

router.delete(
  "/:id",
  protect,
  authorize("RECRUITER"),
  deleteJob
);

export default router;
