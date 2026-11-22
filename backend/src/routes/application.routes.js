import express from "express";

import {
  applyForJob,
  getMyApplications,
    getApplicationById,
  withdrawApplication,
  getJobApplications,
  updateApplicationStatus,
   getRecruiterApplicationDetails,
} from "../controllers/application.controller.js";

import { protect } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";

const router = express.Router();

// All application operations require authentication.
router.use(protect);

// Applicant operations
router.post(
  "/:jobId",
  authorize("APPLICANT"),
  applyForJob
);

router.get(
  "/my-applications",
  authorize("APPLICANT"),
  getMyApplications
);
router.get(
  "/:id",
  authorize("APPLICANT"),
  getApplicationById
);

router.patch(
  "/:id/withdraw",
  authorize("APPLICANT"),
  withdrawApplication
);

// Recruiter operations
router.get(
  "/job/:jobId",
  authorize("RECRUITER"),
  getJobApplications
);


router.get(
  "/job/:jobId/applications/:applicationId",
  authorize("RECRUITER"),
  getRecruiterApplicationDetails
);

router.patch(
  "/:id/status",
  authorize("RECRUITER"),
  updateApplicationStatus
);

export default router;