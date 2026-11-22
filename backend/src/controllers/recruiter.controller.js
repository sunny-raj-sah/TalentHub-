import { recruiterJobsQuerySchema } from "../validators/recruiter.validator.js";

import {
  getRecruiterJobs as getRecruiterJobsService,
} from "../services/job.service.js";

import { getRecruiterDashboard } from "../services/recruiter.service.js";


export const getRecruiterJobs = async (req, res, next) => {
  try {
    const filters = recruiterJobsQuerySchema.parse(req.query);

    const result = await getRecruiterJobsService(
      req.user.id,
      filters
    );

    return res.status(200).json({
      success: true,
      message: "Recruiter jobs fetched successfully.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};



export const getDashboard = async (req, res, next) => {
  try {
    const dashboard = await getRecruiterDashboard(req.user.id);

    return res.status(200).json({
      success: true,
      message: "Recruiter dashboard fetched successfully.",
      data: dashboard,
    });
  } catch (error) {
    next(error);
  }
};
