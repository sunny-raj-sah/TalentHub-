
import express from "express";

import {
  registerApplicant,
  registerRecruiter,
    login,
      refreshSession,
  logout,
   getCurrentUser,
} from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// Applicant registration
router.post("/register/applicant", registerApplicant);

// Recruiter registration
router.post("/register/recruiter", registerRecruiter);

router.post("/login", login);

router.post("/refresh", refreshSession);
router.post("/logout", logout);

router.get("/me", protect, getCurrentUser);

export default router;
