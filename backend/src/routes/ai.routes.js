
import express from "express";

import { hiringAssistant,  interviewPreparation, } from "../controllers/ai.controller.js";


import { aiRateLimiter } from "../middleware/ai-rate-limit.middleware.js";

import { protect } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";

const router = express.Router();

// Only authenticated recruiters can access AI Hiring Assistant.
// router.use(protect, authorize("RECRUITER"));

// Recruiter-only AI endpoint
router.post(
  "/hiring-assistant",
  protect,
  authorize("RECRUITER"),
  aiRateLimiter,
  hiringAssistant
);

// Applicant-only AI endpoint
router.post(
  "/interview-preparation",
  protect,
  authorize("APPLICANT"),
  aiRateLimiter,
  interviewPreparation
);

export default router;
