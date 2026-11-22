 
import express from "express";

import { protect } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";

import {
  uploadResume as uploadResumeMiddleware,
  validateResumeFile,
} from "../middleware/upload.middleware.js";

import {
  uploadResume as uploadResumeController,
  removeResume,
} from "../controllers/resume.controller.js";

import {
  downloadResume,
  downloadResumeFile,
  downloadApplicationResume,
    downloadApplicationResumeFile,
} from "../controllers/resume-access.controller.js";

const router = express.Router();

// All resume endpoints require authentication.
router.use(protect);

// Applicant-only resume upload or replacement.
router.post(
  "/upload",
  authorize("APPLICANT"),
  uploadResumeMiddleware,
  validateResumeFile,
  uploadResumeController
);

// Download the applicant's resume with its original filename.
router.get(
  "/download/:applicantId/file",
  authorize("APPLICANT", "RECRUITER"),
  downloadResumeFile
);

// Generate a temporary download URL.
router.get(
  "/download/:applicantId",
  authorize("APPLICANT", "RECRUITER"),
  downloadResume
);

// Applicant-only resume removal.
router.delete(
  "/",
  authorize("APPLICANT"),
  removeResume
);

// View or download the resume snapshot attached to an application.
router.get(
  "/application/:applicationId/file",
  authorize("APPLICANT", "RECRUITER"),
  downloadApplicationResumeFile
);

// Download the resume snapshot attached to an application.
router.get(
  "/application/:applicationId",
  authorize("APPLICANT", "RECRUITER"),
  downloadApplicationResume
);


export default router;
