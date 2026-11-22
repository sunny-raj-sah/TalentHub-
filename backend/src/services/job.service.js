
import mongoose from "mongoose";
import Job from "../models/Job.js";
import RecruiterProfile from "../models/RecruiterProfile.js";

import Application from "../models/Application.js";
import Bookmark from "../models/Bookmark.js";


const createError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};


const escapeRegex = (value) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const buildJobSort = (sort) => {
  const sortOptions = {
    NEWEST: { createdAt: -1 },
    OLDEST: { createdAt: 1 },
    SALARY_LOW: { "salary.min": 1 },
    SALARY_HIGH: { "salary.max": -1 },
  };

  return sortOptions[sort] || sortOptions.NEWEST;
};


const validateObjectId = (id) => {
  if (!mongoose.isValidObjectId(id)) {
    throw createError("Job not found", 404);
  }
};

// Create a new job.
export const createJob = async (recruiterId, jobData) => {
  const job = await Job.create({
    ...jobData,
    recruiter: recruiterId,
  });

  return job;
};

// Update a job owned by the authenticated recruiter.
export const updateJob = async (jobId, recruiterId, jobData) => {
  validateObjectId(jobId);

  const job = await Job.findOne({
    _id: jobId,
    recruiter: recruiterId,
    status: "ACTIVE",
  });

  if (!job) {
    throw createError("Job not found or you do not own this job", 404);
  }

  Object.assign(job, jobData);

  await job.save();

  return job;
};

// Archive a job owned by the authenticated recruiter.
export const archiveJob = async (jobId, recruiterId) => {
  validateObjectId(jobId);

  const job = await Job.findOne({
    _id: jobId,
    recruiter: recruiterId,
    status: "ACTIVE",
  });

  if (!job) {
    throw createError("Job not found or you do not own this job", 404);
  }

  job.status = "ARCHIVED";

  await job.save();

  return job;
};

// Restore an archived job owned by the authenticated recruiter.
export const restoreJob = async (jobId, recruiterId) => {
  validateObjectId(jobId);

  const job = await Job.findOne({
    _id: jobId,
    recruiter: recruiterId,
    status: "ARCHIVED",
  });

  if (!job) {
    throw createError(
      "Archived job not found or you do not own this job",
      404
    );
  }

  job.status = "ACTIVE";

  await job.save();

  return job;
};


// Permanently delete a job if it has no applications.
export const deleteJob = async (jobId, recruiterId) => {
  validateObjectId(jobId);

  const session = await mongoose.startSession();

  try {
    await session.withTransaction(async () => {
      // Verify that the job belongs to the authenticated recruiter.
      const job = await Job.findOne({
        _id: jobId,
        recruiter: recruiterId,
      }).session(session);

      if (!job) {
        throw createError(
          "Job not found or you do not own this job",
          404
        );
      }

      // Preserve job history when applications already exist.
      const existingApplication = await Application.exists({
        job: jobId,
      }).session(session);

      if (existingApplication) {
        throw createError(
          "This job has applications and cannot be permanently deleted. Archive it instead.",
          409
        );
      }

      // Remove bookmarks associated with this job.
      await Bookmark.deleteMany(
        { job: jobId },
        { session }
      );

      // Permanently delete the job.
      const result = await Job.deleteOne(
        {
          _id: jobId,
          recruiter: recruiterId,
        },
        { session }
      );

      if (result.deletedCount !== 1) {
        throw createError(
          "Unable to delete this job. Please try again.",
          500
        );
      }
    });

    return {
      jobId,
    };
  } finally {
    await session.endSession();
  }
};

// Retrieve an individual active job.
export const getJobById = async (jobId) => {
  validateObjectId(jobId);

  const job = await Job.findOne({
    _id: jobId,
    status: "ACTIVE",
  }).populate("recruiter", "name");

  if (!job) {
    throw createError("Job not found", 404);
  }

  const recruiterProfile = await RecruiterProfile.findOne({
    user: job.recruiter._id,
  }).select("companyName companyLogoUrl website aboutCompany");

  return {
    job,
    recruiterProfile,
  };
};



export const getJobs = async (filters) => {
  const {
    search,
    location,
    employmentType,
    workMode,
    minSalary,
    maxSalary,
    minExperience,
    maxExperience,
    sort,
    page,
    limit,
  } = filters;

  const query = {
    status: "ACTIVE",
    applicationDeadline: { $gte: new Date() },
  };

  // Keyword search across title, description, and skills.
  if (search) {
    const searchRegex = new RegExp(escapeRegex(search), "i");

    query.$or = [
      { title: searchRegex },
      { description: searchRegex },
      { skills: searchRegex },
    ];
  }

  // Location filter.
  if (location) {
    query.location = {
      $regex: escapeRegex(location),
      $options: "i",
    };
  }

  // Employment type filter.
  if (employmentType) {
    query.employmentType = employmentType;
  }

  // Work mode filter.
  if (workMode) {
    query.workMode = workMode;
  }

  // Salary overlap filter.
  if (minSalary !== undefined) {
    query["salary.max"] = { $gte: minSalary };
  }

  if (maxSalary !== undefined) {
    query["salary.min"] = {
      ...(query["salary.min"] || {}),
      $lte: maxSalary,
    };
  }

  // Experience overlap filter.
  if (maxExperience !== undefined) {
    query["experience.min"] = { $lte: maxExperience };
  }

  if (minExperience !== undefined) {
    query["experience.max"] = {
      $gte: minExperience,
    };
  }

  const skip = (page - 1) * limit;

  const [jobs, totalJobs] = await Promise.all([
    Job.find(query)
      .populate("recruiter", "name")
      .sort(buildJobSort(sort))
      .skip(skip)
      .limit(limit)
      .lean(),

    Job.countDocuments(query),
  ]);

  return {
    jobs,
    pagination: {
      currentPage: page,
      limit,
      totalJobs,
      totalPages: Math.ceil(totalJobs / limit),
      hasNextPage: page * limit < totalJobs,
      hasPreviousPage: page > 1,
    },
  };
};


export const getFeaturedJobs = async (limit = 6) => {
  const jobs = await Job.find({
    status: "ACTIVE",
    // isFeatured: true,
    applicationDeadline: { $gte: new Date() },
  })
    .populate("recruiter", "name")
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();

  return jobs;
};

export const getRecentJobs = async (limit = 8) => {
  const jobs = await Job.find({
    status: "ACTIVE",
    applicationDeadline: { $gte: new Date() },
  })
    .populate("recruiter", "name")
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();

  return jobs;
};


export const getSimilarJobs = async (jobId, limit = 6) => {
  validateObjectId(jobId);

  const currentJob = await Job.findOne({
    _id: jobId,
    status: "ACTIVE",
    applicationDeadline: { $gte: new Date() },
  }).lean();

  if (!currentJob) {
    throw createError("Job not found.", 404);
  }

  const similarJobs = await Job.aggregate([
    {
      $match: {
        _id: { $ne: currentJob._id },
        status: "ACTIVE",
        applicationDeadline: { $gte: new Date() },
        $or: [
          { skills: { $in: currentJob.skills } },
          { employmentType: currentJob.employmentType },
          { workMode: currentJob.workMode },
          { location: currentJob.location },
        ],
      },
    },
    {
      $addFields: {
        similarityScore: {
          $add: [
            {
              $multiply: [
                {
                  $size: {
                    $setIntersection: ["$skills", currentJob.skills],
                  },
                },
                3,
              ],
            },
            {
              $cond: [
                { $eq: ["$employmentType", currentJob.employmentType] },
                2,
                0,
              ],
            },
            {
              $cond: [
                { $eq: ["$workMode", currentJob.workMode] },
                2,
                0,
              ],
            },
            {
              $cond: [
                { $eq: ["$location", currentJob.location] },
                1,
                0,
              ],
            },
          ],
        },
      },
    },
    {
      $sort: {
        similarityScore: -1,
        createdAt: -1,
      },
    },
    { $limit: limit },
    {
      $lookup: {
        from: "users",
        localField: "recruiter",
        foreignField: "_id",
        as: "recruiter",
      },
    },
    {
      $unwind: {
        path: "$recruiter",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        "recruiter.password": 0,
        "recruiter.refreshTokenHash": 0,
        "recruiter.__v": 0,
      },
    },
  ]);

  return similarJobs;
};

// export const getRecruiterJobs = async (
//   recruiterId,
//   filters
// ) => {
//   validateObjectId(recruiterId);

//   const { status, page, limit } = filters;

//   const query = {
//     recruiter: recruiterId,
//     ...(status && { status }),
//   };

//   const skip = (page - 1) * limit;

//   const [jobs, totalJobs] = await Promise.all([
//     Job.find(query)
//       .sort({ createdAt: -1 })
//       .skip(skip)
//       .limit(limit)
//       .lean(),

//     Job.countDocuments(query),
//   ]);

//   return {
//     jobs,
//     pagination: {
//       totalJobs,
//       currentPage: page,
//       totalPages: Math.ceil(totalJobs / limit),
//       limit,
//       hasNextPage: page * limit < totalJobs,
//       hasPreviousPage: page > 1,
//     },
//   };
// };


export const getRecruiterJobs = async (
  recruiterId,
  filters
) => {
  validateObjectId(recruiterId);

  const { status, search, page, limit, sort } = filters;

  // Always restrict results to jobs owned by this recruiter.
  const query = {
    recruiter: recruiterId,
    ...(status && { status }),
  };

  // Search across job title, skills, and location.
  if (search) {
    const searchRegex = new RegExp(escapeRegex(search), "i");

    query.$or = [
      { title: searchRegex },
      { skills: searchRegex },
      { location: searchRegex },
    ];
  }

  const skip = (page - 1) * limit;

  const sortOptions = {
    NEWEST: { createdAt: -1 },
    OLDEST: { createdAt: 1 },
  };

  const [jobs, totalJobs] = await Promise.all([
    Job.find(query)
      .sort(sortOptions[sort] || sortOptions.NEWEST)
      .skip(skip)
      .limit(limit)
      .lean(),

    Job.countDocuments(query),
  ]);

  return {
    jobs,
    pagination: {
      totalJobs,
      currentPage: page,
      totalPages: Math.ceil(totalJobs / limit),
      limit,
      hasNextPage: page * limit < totalJobs,
      hasPreviousPage: page > 1,
    },
  };
};


export const getRecruiterJobById = async (recruiterId, jobId) => {
  if (
    !mongoose.isValidObjectId(recruiterId) ||
    !mongoose.isValidObjectId(jobId)
  ) {
    throw createError("Invalid recruiter or job ID.", 400);
  }

  const job = await Job.findOne({
    _id: jobId,
    recruiter: recruiterId,
  }).lean();

  if (!job) {
    throw createError("Job not found or you do not own this job.", 404);
  }

  return job;
};
