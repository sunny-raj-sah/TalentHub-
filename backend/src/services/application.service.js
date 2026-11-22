import mongoose from "mongoose";

import Application from "../models/Application.js";
import Job from "../models/Job.js";
import ApplicantProfile from "../models/ApplicantProfile.js";
 


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

export const applyForJob = async (applicantId, jobId, applicationData) => {
  validateObjectId(applicantId);
  validateObjectId(jobId);

  // 1. Find an active job whose deadline has not passed.
  const job = await Job.findOne({
    _id: jobId,
    status: "ACTIVE",
    applicationDeadline: { $gte: new Date() },
  }).select("_id recruiter");

  if (!job) {
    throw createError(
      "Job not found, archived, or application deadline has passed.",
      404
    );
  }

  // 2. Check whether the applicant has already applied.
  const existingApplication = await Application.findOne({
    applicant: applicantId,
    job: jobId,
  }).select("_id");

  if (existingApplication) {
    throw createError(
      "You have already applied for this job.",
      409
    );
  }

  // 3. Use the applicant's profile resume if no resume URL is supplied.
  const applicantProfile = await ApplicantProfile.findOne({
  user: applicantId,
}).select(
  "resumeUrl resumePublicId resumeOriginalName resumeMimeType resumeSize"
);

//   const resumeUrl =
//     applicationData.resumeUrl || applicantProfile?.resumeUrl || "";

  // 4. Create the application.
  try {
    // const application = await Application.create({
    //   applicant: applicantId,
    //   job: job._id,
    //   recruiter: job.recruiter,
    //   coverLetter: applicationData.coverLetter || "",
    //   resumeUrl,
    //   status: "PENDING",
    // });
const application = await Application.create({
  applicant: applicantId,
  job: jobId,
  recruiter: job.recruiter,

  coverLetter: applicationData.coverLetter || "",

  // Keep support for any existing legacy resume URL.
  resumeUrl: applicantProfile?.resumeUrl || "",

  // Snapshot of the private resume at application time.
  resumePublicId: applicantProfile?.resumePublicId || "",
  resumeOriginalName: applicantProfile?.resumeOriginalName || "",
  resumeMimeType: applicantProfile?.resumeMimeType || "",
  resumeSize: applicantProfile?.resumeSize || 0,

  status: "PENDING",
});
    return application;
  } catch (error) {
    // The unique compound index also protects against simultaneous requests.
    if (error.code === 11000) {
      throw createError(
        "You have already applied for this job.",
        409
      );
    }

    throw error;
  }
};

export const getMyApplications = async (applicantId, filters) => {
  validateObjectId(applicantId);

  const { status, page, limit } = filters;

  const query = {
    applicant: applicantId,
    ...(status && { status }),
  };

  const skip = (page - 1) * limit;

  const [applications, totalApplications] = await Promise.all([
    Application.find(query)
        .populate({
        path: "job",
        select: "title location employmentType workMode salary status",
      })
      .populate({
        path: "recruiter",
        select: "name",
      })
      .sort({ appliedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),

    Application.countDocuments(query),
  ]);

  return {
    applications,
    pagination: {
      totalApplications,
      currentPage: page,
      totalPages: Math.ceil(totalApplications / limit),
      limit,
      hasNextPage: page * limit < totalApplications,
      hasPreviousPage: page > 1,
    },
  };
};

export const getApplicationById = async (applicantId, applicationId) => {
  validateObjectId(applicantId);
  validateObjectId(applicationId);

  const application = await Application.findOne({
    _id: applicationId,
    applicant: applicantId,
  })
    .select("-resumePublicId -resumeUrl")
    .populate({
      path: "job",
      select:
        "title description location employmentType workMode salary status applicationDeadline",
    })
    .populate({
      path: "recruiter",
      select: "name",
    })
    .lean();

  if (!application) {
    throw createError("Application not found.", 404);
  }

  return application;
};

export const withdrawApplication = async (
  applicantId,
  applicationId
) => {
  validateObjectId(applicantId);
  validateObjectId(applicationId);

  const application = await Application.findOneAndUpdate(
    {
      _id: applicationId,
      applicant: applicantId,
      status: { $in: ["PENDING", "SHORTLISTED"] },
    },
    {
      $set: {
        status: "WITHDRAWN",
        statusUpdatedAt: new Date(),
      },
    },
    {
      new: true,
      runValidators: true,
    }
  ).select("-resumePublicId -resumeUrl");

  if (application) {
    return application;
  }

  // Determine whether the application doesn't exist or cannot be withdrawn.
  const existingApplication = await Application.findOne({
    _id: applicationId,
    applicant: applicantId,
  }).select("status");

  if (!existingApplication) {
    throw createError("Application not found.", 404);
  }

  throw createError(
    `Application cannot be withdrawn because its status is ${existingApplication.status}.`,
    409
  );
};


export const getJobApplications = async (
  recruiterId,
  jobId,
  filters
) => {
  validateObjectId(recruiterId);
  validateObjectId(jobId);

  const { status, page, limit, sort } = filters;

  // Verify that this job belongs to the authenticated recruiter.
  const job = await Job.findOne({
    _id: jobId,
    recruiter: recruiterId,
  }).select("_id title");

  if (!job) {
    throw createError("Job not found.", 404);
  }

  const query = {
    job: jobId,
    recruiter: recruiterId,
    ...(status && { status }),
  };

  const skip = (page - 1) * limit;

  const sortOrder = sort === "OLDEST" ? 1 : -1;

  const [applications, totalApplications] = await Promise.all([
    Application.find(query)
    .select("-resumePublicId -resumeUrl")
      .populate({
        path: "applicant",
        select: "name email",
      })
      .sort({ appliedAt: sortOrder })
      .skip(skip)
      .limit(limit)
      .lean(),

    Application.countDocuments(query),
  ]);

  return {
    job,
    applications,
    pagination: {
      totalApplications,
      currentPage: page,
      totalPages: Math.ceil(totalApplications / limit),
      limit,
      hasNextPage: page * limit < totalApplications,
      hasPreviousPage: page > 1,
    },
  };
};




 

export const getRecruiterApplicationDetails = async (
  recruiterId,
  jobId,
  applicationId
) => {
  validateObjectId(recruiterId);
  validateObjectId(jobId);
  validateObjectId(applicationId);

  // Verify that this application belongs to the recruiter's job.
  const application = await Application.findOne({
    _id: applicationId,
    job: jobId,
    recruiter: recruiterId,
  })
    // Never expose private Cloudinary identifiers or URLs.
    .select("-resumePublicId -resumeUrl")
    .populate({
      path: "applicant",
      select: "name email",
    })
    .populate({
      path: "job",
      select: "title location employmentType workMode",
    })
    .lean();

  if (!application) {
    throw createError("Application not found.", 404);
  }

  if (!application.applicant) {
    throw createError("Applicant account not found.", 404);
  }

  // Fetch the applicant's current public profile information.
  const applicantProfile = await ApplicantProfile.findOne({
    user: application.applicant._id,
  })
    .select("photoUrl bio experience education skills")
    .lean();

  return {
    application,
    applicantProfile,
  };
};


export const updateApplicationStatus = async (
  recruiterId,
  applicationId,
  status
) => {
  validateObjectId(recruiterId);
  validateObjectId(applicationId);

  const application = await Application.findOneAndUpdate(
    {
      _id: applicationId,
      recruiter: recruiterId,
      status:  {
    $in: ["PENDING", "SHORTLISTED", "REJECTED"],
  },
    },
    {
      $set: {
        status,
        statusUpdatedAt: new Date(),
      },
    },
    {
      new: true,
      runValidators: true,
    }
  )
  .select("-resumePublicId -resumeUrl")
  .populate({
    path: "applicant",
    select: "name email",
  });

  if (application) {
    return application;
  }

  const existingApplication = await Application.findOne({
    _id: applicationId,
    recruiter: recruiterId,
  }).select("status");

  if (!existingApplication) {
    throw createError("Application not found.", 404);
  }

  throw createError(
    `Application cannot be updated because its current status is ${existingApplication.status}.`,
    409
  );
};

export const getRecruiterAIApplicationContext = async (
  recruiterId,
  jobId,
  candidateLimit = 50,
    includeWithdrawn = false
) => {
  if (
    !mongoose.isValidObjectId(recruiterId) ||
    !mongoose.isValidObjectId(jobId)
  ) {
    throw createError("Invalid recruiter or job ID.", 400);
  }

  const job = await Job.findOne({
    _id: jobId,
    recruiter: recruiterId,
  })
    .select("_id title")
    .lean();

  if (!job) {
    throw createError("Job not found or you do not own this job.", 404);
  }

  const applicationFilter = {
    job: jobId,
    recruiter: recruiterId,
  };

  const [
    totalApplications,
    pendingApplications,
    shortlistedApplications,
    rejectedApplications,
    withdrawnApplications,
  ] = await Promise.all([
    Application.countDocuments(applicationFilter),
    Application.countDocuments({
      ...applicationFilter,
      status: "PENDING",
    }),
    Application.countDocuments({
      ...applicationFilter,
      status: "SHORTLISTED",
    }),
    Application.countDocuments({
      ...applicationFilter,
      status: "REJECTED",
    }),
    Application.countDocuments({
      ...applicationFilter,
      status: "WITHDRAWN",
    }),
  ]);

  const activeApplications = totalApplications - withdrawnApplications;

  const shortlistPercentage =
    activeApplications > 0
      ? Number(
          ((shortlistedApplications / activeApplications) * 100).toFixed(2)
        )
      : 0;

  // const applications = await Application.find({
  //   ...applicationFilter,
  //   status: { $ne: "WITHDRAWN" },
  // })
  const candidateFilter = {
  ...applicationFilter,
  ...(includeWithdrawn
    ? {}
    : { status: { $ne: "WITHDRAWN" } }),
};

const applications = await Application.find(candidateFilter).select(
      "_id applicant status coverLetter appliedAt resumeOriginalName resumeMimeType resumeSize"
    )
    .populate("applicant", "name")
    .sort({ appliedAt: -1 })
    .limit(candidateLimit)
    .lean();

  const applicantIds = applications
    .map((application) => application.applicant?._id)
    .filter(Boolean);

  const profiles = await ApplicantProfile.find({
    user: { $in: applicantIds },
  })
    .select("user bio experience education skills")
    .lean();

  const profileMap = new Map(
    profiles.map((profile) => [profile.user.toString(), profile])
  );

  const candidates = applications
    .filter((application) => application.applicant?._id)
    .map((application) => {
      const applicant = application.applicant;
      const profile = profileMap.get(applicant._id.toString());

      return {
        applicationId: application._id,
        applicantId: applicant._id,
        name: applicant.name,
        status: application.status,
        appliedAt: application.appliedAt,
        coverLetter: application.coverLetter || "",
        resume: {
          originalName: application.resumeOriginalName || "",
          mimeType: application.resumeMimeType || "",
          size: application.resumeSize || 0,
        },
//         withdrawnAnalysisIncluded: includeWithdrawn,

// withdrawnCandidatesRetrieved: candidates.filter(
//   (candidate) => candidate.status === "WITHDRAWN"
// ).length,

        profile: profile
          ? {
              bio: profile.bio || "",
              experience: profile.experience || [],
              education: profile.education || [],
              skills: profile.skills || [],
            }
          : null,
      };
      
    });

  // return {
  //   job,
  //   analytics: {
  //     totalApplications,
  //     pendingApplications,
  //     shortlistedApplications,
  //     rejectedApplications,
  //     withdrawnApplications,
  //     activeApplications,
  //     shortlistPercentage,
  //   },
  //   candidates,
  //   candidatesRetrieved: candidates.length,
  //   candidateLimit,
  //   // candidatesTruncated: activeApplications > candidates.length,

  //   candidatesTruncated:
  // (includeWithdrawn ? totalApplications : activeApplications) >
  // candidates.length,
  // };
return {
  job,

  analytics: {
    totalApplications,
    pendingApplications,
    shortlistedApplications,
    rejectedApplications,
    withdrawnApplications,
    activeApplications,
    shortlistPercentage,
  },

  candidates,

  candidatesRetrieved: candidates.length,
  candidateLimit,

  candidatesTruncated:
    (includeWithdrawn ? totalApplications : activeApplications) >
    candidates.length,

  withdrawnAnalysisIncluded: includeWithdrawn,

  withdrawnCandidatesRetrieved: candidates.filter(
    (candidate) => candidate.status === "WITHDRAWN"
  ).length,
};
};