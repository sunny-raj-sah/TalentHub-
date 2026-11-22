
import express from "express";
import {
  getProfile,
  updateProfile,
    getUserPublicProfile,
} from "../controllers/profile.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(protect);

router.get("/profile", getProfile);
router.put("/profile", updateProfile);
router.get("/:id", getUserPublicProfile);

export default router;
