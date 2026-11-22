 

import {
  createJobSchema,
  updateJobSchema,
} from "../validators/job.validator.js";

import { jobQuerySchema } from "../validators/job-query.validator.js";

import {
  createJob as createJobService,
  updateJob as updateJobService,
  archiveJob as archiveJobService,
  restoreJob as restoreJobService,
  deleteJob as deleteJobService,
  getJobById as getJobByIdService,
  getJobs as getJobsService,
  getFeaturedJobs as getFeaturedJobsService,
  getRecentJobs as getRecentJobsService,
  getSimilarJobs as getSimilarJobsService,
} from "../services/job.service.js";

// POST: Create a job
export const createJob = async (req, res, next) => {
  try {
    const validation = createJobSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Job validation failed",
        errors: validation.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
    }

    const job = await createJobService(req.user.id, validation.data);

    return res.status(201).json({
      success: true,
      message: "Job created successfully",
      data: { job },
    });
  } catch (error) {
    next(error);
  }
};

// PUT: Update a job
export const updateJob = async (req, res, next) => {
  try {
    const validation = updateJobSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Job update validation failed",
        errors: validation.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
    }

    const job = await updateJobService(
      req.params.id,
      req.user.id,
      validation.data
    );

    return res.status(200).json({
      success: true,
      message: "Job updated successfully",
      data: { job },
    });
  } catch (error) {
    next(error);
  }
};

// PATCH: Archive a job
export const archiveJob = async (req, res, next) => {
  try {
    const job = await archiveJobService(
      req.params.id,
      req.user.id
    );

    return res.status(200).json({
      success: true,
      message: "Job archived successfully",
      data: { job },
    });
  } catch (error) {
    next(error);
  }
};

// PATCH: Restore an archived job
export const restoreJob = async (req, res, next) => {
  try {
    const job = await restoreJobService(
      req.params.id,
      req.user.id
    );

    return res.status(200).json({
      success: true,
      message: "Job restored successfully",
      data: { job },
    });
  } catch (error) {
    next(error);
  }
};

// DELETE: Permanently delete a job
export const deleteJob = async (req, res, next) => {
  try {
    await deleteJobService(
      req.params.id,
      req.user.id
    );

    return res.status(200).json({
      success: true,
      message: "Job deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// GET: Retrieve an individual job
export const getJobById = async (req, res, next) => {
  try {
    const result = await getJobByIdService(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Job fetched successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// GET: Retrieve jobs with filters
export const getJobs = async (req, res, next) => {
  try {
    const validation = jobQuerySchema.safeParse(req.query);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid job search filters",
        errors: validation.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
    }

    const result = await getJobsService(validation.data);

    return res.status(200).json({
      success: true,
      message: "Jobs fetched successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// GET: Featured jobs
export const getFeaturedJobs = async (req, res, next) => {
  try {
    const jobs = await getFeaturedJobsService();

    return res.status(200).json({
      success: true,
      message: "Featured jobs fetched successfully",
      data: { jobs },
    });
  } catch (error) {
    next(error);
  }
};

// GET: Recent jobs
export const getRecentJobs = async (req, res, next) => {
  try {
    const jobs = await getRecentJobsService();

    return res.status(200).json({
      success: true,
      message: "Recent jobs fetched successfully",
      data: { jobs },
    });
  } catch (error) {
    next(error);
  }
};

// GET: Similar jobs
export const getSimilarJobs = async (req, res, next) => {
  try {
    const jobs = await getSimilarJobsService(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Similar jobs fetched successfully.",
      data: { jobs },
    });
  } catch (error) {
    next(error);
  }
};
