import express from "express";

import {
  addBookmark,
  removeBookmark,
  getMyBookmarks,
} from "../controllers/bookmark.controller.js";

import { protect } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";

const router = express.Router();

// All bookmark operations require applicant authentication.
router.use(protect, authorize("APPLICANT"));

// Get all saved jobs.
router.get("/", getMyBookmarks);

// Add a job to bookmarks.
router.post("/:jobId", addBookmark);

// Remove a job from bookmarks.
router.delete("/:jobId", removeBookmark);

export default router;