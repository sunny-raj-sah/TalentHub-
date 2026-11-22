
import express from "express";
import mongoose from "mongoose";

const router = express.Router();

router.get("/", (req, res) => {
  const databaseConnected =
    mongoose.connection.readyState === 1;

  return res.status(200).json({
    success: true,
    message: "TalentHub API is running",
    data: {
      server: "running",
      database: databaseConnected
        ? "connected"
        : "disconnected",
    },
  });
});

export default router;
