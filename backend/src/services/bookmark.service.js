import mongoose from "mongoose";

import Bookmark from "../models/Bookmark.js";
import Job from "../models/Job.js";

const createError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const validateObjectId = (id) => {
  if (!mongoose.isValidObjectId(id)) {
    throw createError("Invalid ID provided.", 404);
  }
};

// Add a job to bookmarks.
export const addBookmark = async (applicantId, jobId) => {
  validateObjectId(applicantId);
  validateObjectId(jobId);

  const job = await Job.findOne({
    _id: jobId,
    status: "ACTIVE",
    applicationDeadline: { $gte: new Date() },
  }).select("_id");

  if (!job) {
    throw createError(
      "Job not found, archived, or application deadline has passed.",
      404
    );
  }

  try {
    const bookmark = await Bookmark.create({
      applicant: applicantId,
      job: job._id,
    });

    return bookmark;
  } catch (error) {
    if (error.code === 11000) {
      throw createError("You have already bookmarked this job.", 409);
    }

    throw error;
  }
};

// Remove a job from bookmarks.
export const removeBookmark = async (applicantId, jobId) => {
  validateObjectId(applicantId);
  validateObjectId(jobId);

  const bookmark = await Bookmark.findOneAndDelete({
    applicant: applicantId,
    job: jobId,
  });

  if (!bookmark) {
    throw createError("Bookmark not found.", 404);
  }

  return bookmark;
};

// Retrieve an applicant's bookmarked jobs.
export const getMyBookmarks = async (applicantId, filters) => {
  validateObjectId(applicantId);

  const { page, limit } = filters;
  const skip = (page - 1) * limit;

  const query = { applicant: applicantId };

  const [bookmarks, totalBookmarks] = await Promise.all([
    Bookmark.find(query)
      .populate({
        path: "job",
        match: {
          status: "ACTIVE",
          applicationDeadline: { $gte: new Date() },
        },
        select:
          "title description skills salary experience location employmentType workMode applicationDeadline recruiter createdAt",
        populate: {
          path: "recruiter",
          select: "name",
        },
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),

    Bookmark.countDocuments(query),
  ]);

  // Exclude bookmarks whose jobs are no longer publicly available.
  const activeBookmarks = bookmarks.filter(
    (bookmark) => bookmark.job !== null
  );

  return {
    bookmarks: activeBookmarks,
    pagination: {
      totalBookmarks,
      currentPage: page,
      totalPages: Math.ceil(totalBookmarks / limit),
      limit,
      hasNextPage: page * limit < totalBookmarks,
      hasPreviousPage: page > 1,
    },
  };
};