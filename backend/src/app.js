
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import { env } from "./config/env.js";

import healthRoutes from "./routes/health.routes.js";

import notFound from "./middleware/notFound.middleware.js";
import errorHandler from "./middleware/error.middleware.js";

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import jobRoutes from "./routes/job.routes.js";
import recruiterRoutes from "./routes/recruiter.routes.js";
import applicationRoutes from "./routes/application.routes.js";

import bookmarkRoutes from "./routes/bookmark.routes.js";
import aiRoutes from "./routes/ai.routes.js";
import resumeRoutes from "./routes/resume.routes.js";


const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  })
);

// Request logging
if (env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Body parsing
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

// Cookie parsing
app.use(cookieParser());

// Health check
app.use("/api/health", healthRoutes);
// Authentication routes
app.use("/api/auth", authRoutes);

app.use("/api/users", userRoutes);
 
app.use("/api/jobs", jobRoutes);

app.use("/api/recruiter", recruiterRoutes);

app.use("/api/applications", applicationRoutes);
app.use("/api/bookmarks", bookmarkRoutes);


app.use("/api/ai", aiRoutes);

app.use("/api/resume", resumeRoutes);

// Handle unknown routes
app.use(notFound);

// Centralized error handling
app.use(errorHandler);

export default app;
