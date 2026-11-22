import {
  createApplicationSchema,
  updateApplicationStatusSchema,
  myApplicationsQuerySchema,
  recruiterApplicationsQuerySchema,
} from "../validators/application.validator.js";

import {
  applyForJob as applyForJobService,
  getMyApplications as getMyApplicationsService,
   getApplicationById as getApplicationByIdService,
  withdrawApplication as withdrawApplicationService,
  getJobApplications as getJobApplicationsService,
  updateApplicationStatus as updateApplicationStatusService,
  getRecruiterApplicationDetails as getRecruiterApplicationDetailsService,
} from "../services/application.service.js";

// Applicant applies for a job.
export const applyForJob = async (req, res, next) => {
  try {
    const applicationData = createApplicationSchema.parse(req.body);

    const application = await applyForJobService(
      req.user.id,
      req.params.jobId,
      applicationData
    );

    return res.status(201).json({
      success: true,
      message: "Application submitted successfully.",
      data: { application },
    });
  } catch (error) {
    next(error);
  }
};

// Applicant views their own applications.
export const getMyApplications = async (req, res, next) => {
  try {
    const filters = myApplicationsQuerySchema.parse(req.query);

    const result = await getMyApplicationsService(
      req.user.id,
      filters
    );

    return res.status(200).json({
      success: true,
      message: "Applications fetched successfully.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Applicant views one of their own applications.
export const getApplicationById = async (req, res, next) => {
  try {
    const application = await getApplicationByIdService(
      req.user.id,
      req.params.id
    );

    return res.status(200).json({
      success: true,
      message: "Application details fetched successfully.",
      data: { application },
    });
  } catch (error) {
    next(error);
  }
};

// Applicant withdraws an application.
export const withdrawApplication = async (req, res, next) => {
  try {
    const application = await withdrawApplicationService(
      req.user.id,
      req.params.id
    );

    return res.status(200).json({
      success: true,
      message: "Application withdrawn successfully.",
      data: { application },
    });
  } catch (error) {
    next(error);
  }
};

// Recruiter views applications for their job.
export const getJobApplications = async (req, res, next) => {
  try {
    const filters = recruiterApplicationsQuerySchema.parse(req.query);

    const result = await getJobApplicationsService(
      req.user.id,
      req.params.jobId,
      filters
    );

    return res.status(200).json({
      success: true,
      message: "Job applications fetched successfully.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Recruiter shortlists or rejects an applicant.
export const updateApplicationStatus = async (req, res, next) => {
  try {
    const { status } = updateApplicationStatusSchema.parse(req.body);

    const application = await updateApplicationStatusService(
      req.user.id,
      req.params.id,
      status
    );

    return res.status(200).json({
      success: true,
      message: `Application ${status.toLowerCase()} successfully.`,
      data: { application },
    });
  } catch (error) {
    next(error);
  }
};


export const getRecruiterApplicationDetails = async (req, res, next) => {
  try {
    const result = await getRecruiterApplicationDetailsService(
      req.user.id,
      req.params.jobId,
      req.params.applicationId
    );

    return res.status(200).json({
      success: true,
      message: "Applicant details fetched successfully.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
