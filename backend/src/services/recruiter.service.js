import mongoose from "mongoose";

import Job from "../models/Job.js";
import Application from "../models/Application.js";

const createError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const validateObjectId = (id) => {
  if (!mongoose.isValidObjectId(id)) {
    throw createError("Invalid recruiter ID.", 404);
  }
};

export const getRecruiterDashboard = async (recruiterId) => {
  validateObjectId(recruiterId);

  // Job statistics.
  const jobQuery = {
    recruiter: recruiterId,
  };

  // Application statistics.
  const applicationQuery = {
    recruiter: recruiterId,
  };

  const [
    totalJobs,
    activeJobs,
    archivedJobs,
    totalApplications,
    pendingApplications,
    shortlistedApplications,
    rejectedApplications,
    withdrawnApplications,
    recentApplications,
  ] = await Promise.all([
    Job.countDocuments(jobQuery),

    Job.countDocuments({
      ...jobQuery,
      status: "ACTIVE",
    }),

    Job.countDocuments({
      ...jobQuery,
      status: "ARCHIVED",
    }),

    Application.countDocuments(applicationQuery),

    Application.countDocuments({
      ...applicationQuery,
      status: "PENDING",
    }),

    Application.countDocuments({
      ...applicationQuery,
      status: "SHORTLISTED",
    }),

    Application.countDocuments({
      ...applicationQuery,
      status: "REJECTED",
    }),

    Application.countDocuments({
      ...applicationQuery,
      status: "WITHDRAWN",
    }),

    Application.find(applicationQuery)
      .populate({
        path: "applicant",
        select: "name email",
      })
      .populate({
        path: "job",
        select: "title location employmentType workMode",
      })
      .sort({ appliedAt: -1 })
      .limit(5)
      .lean(),
  ]);

  return {
    overview: {
      totalJobs,
      activeJobs,
      archivedJobs,
      totalApplications,
      pendingApplications,
      shortlistedApplications,
      rejectedApplications,
      withdrawnApplications,
    },

    recentApplications,
  };
};