 

import mongoose from "mongoose";
import { CanvasFactory } from "pdf-parse/worker";
import { PDFParse } from "pdf-parse";


import cloudinary from "../config/cloudinary.js";
import ApplicantProfile from "../models/ApplicantProfile.js";
import Application from "../models/Application.js";

const createError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

 
 
//   // Our uploaded raw PDF public IDs include the .pdf extension.
//   const normalizedPublicId = publicId.replace(/\.pdf$/i, "");

//   const expiresAt = Math.floor(Date.now() / 1000) + 5 * 60;

//   return cloudinary.utils.private_download_url(
//     normalizedPublicId,
//     "pdf",
//     {
//       resource_type: "raw",
//       type: "private",
//       expires_at: expiresAt,
//       attachment: true,
//     }
//   );
// };
// Generate a temporary private Cloudinary download URL.
// const generateResumeDownloadUrl = (publicId) => {
//   const expiresAt = Math.floor(Date.now() / 1000) + 5 * 60;

//   return cloudinary.utils.private_download_url(
//     publicId,
//     "pdf",
//     {
//       resource_type: "raw",
//       type: "private",
//       expires_at: expiresAt,
//       attachment: true,
//     }
//   );
// };

// Generate a temporary private Cloudinary URL for viewing or downloading.
const generateResumeDownloadUrl = (publicId, attachment = true) => {
  const expiresAt = Math.floor(Date.now() / 1000) + 5 * 60;

  return cloudinary.utils.private_download_url(
    publicId,
    "pdf",
    {
      resource_type: "raw",
      type: "private",
      expires_at: expiresAt,
      attachment,
    }
  );
};

// Return resume metadata without exposing its Cloudinary public ID.
// const createResumeResponse = (downloadUrl, resume) => ({
//   downloadUrl,
//   expiresInSeconds: 300,
//   resume: {
//     originalName: resume.originalName,
//     mimeType: resume.mimeType,
//     size: resume.size,
//   },
// });
// Return resume metadata and temporary viewing/downloading URLs.
const createResumeResponse = (viewUrl, downloadUrl, resume) => ({
  viewUrl,
  downloadUrl,
  expiresInSeconds: 300,
  resume: {
    originalName: resume.originalName,
    mimeType: resume.mimeType,
    size: resume.size,
  },
});

// export const getResumeDownloadUrl = async (
//   requester,
//   applicantId,
//     attachment = true
// ) => {
//   if (!mongoose.isValidObjectId(applicantId)) {
//     throw createError("Invalid applicant ID.", 400);
//   }

//   const requesterId = String(requester.id);
//   const targetApplicantId = String(applicantId);

//   // Applicants can access only their own resumes.
//   if (
//     requester.role === "APPLICANT" &&
//     requesterId !== targetApplicantId
//   ) {
//     throw createError(
//       "You are not authorized to access this resume.",
//       403
//     );
//   }

//   // Recruiters must have a non-withdrawn application from this applicant.
//   if (requester.role === "RECRUITER") {
//     const application = await Application.findOne({
//       applicant: targetApplicantId,
//       recruiter: requesterId,
//       status: { $ne: "WITHDRAWN" },
//     }).select("_id");

//     if (!application) {
//       throw createError(
//         "You are not authorized to access this resume.",
//         403
//       );
//     }
//   }

//   const profile = await ApplicantProfile.findOne({
//     user: targetApplicantId,
//   }).select(
//     "resumePublicId resumeOriginalName resumeMimeType resumeSize"
//   );

//   if (!profile || !profile.resumePublicId) {
//     throw createError("Resume not found.", 404);
//   }

//   const downloadUrl = generateResumeDownloadUrl(
//     profile.resumePublicId,
//       attachment
//   );

//   return createResumeResponse(downloadUrl, {
//     originalName: profile.resumeOriginalName,
//     mimeType: profile.resumeMimeType,
//     size: profile.resumeSize,
//   });
// };

export const getResumeDownloadUrl = async (
  requester,
  applicantId,
  attachment = true
) => {
  if (!mongoose.isValidObjectId(applicantId)) {
    throw createError("Invalid applicant ID.", 400);
  }

  const requesterId = String(requester.id);
  const targetApplicantId = String(applicantId);

  // Applicants can access only their own resumes.
  if (
    requester.role === "APPLICANT" &&
    requesterId !== targetApplicantId
  ) {
    throw createError(
      "You are not authorized to access this resume.",
      403
    );
  }

  // Recruiters must have a non-withdrawn application from this applicant.
  if (requester.role === "RECRUITER") {
    const application = await Application.findOne({
      applicant: targetApplicantId,
      recruiter: requesterId,
      status: { $ne: "WITHDRAWN" },
    }).select("_id");

    if (!application) {
      throw createError(
        "You are not authorized to access this resume.",
        403
      );
    }
  }

  const profile = await ApplicantProfile.findOne({
    user: targetApplicantId,
  }).select(
    "resumePublicId resumeOriginalName resumeMimeType resumeSize"
  );

  if (!profile || !profile.resumePublicId) {
    throw createError("Resume not found.", 404);
  }

  // Generate a temporary URL for inline viewing.
  const viewUrl = generateResumeDownloadUrl(
    profile.resumePublicId,
    false
  );

  // Preserve the existing attachment behavior for downloads.
  const downloadUrl = generateResumeDownloadUrl(
    profile.resumePublicId,
    attachment
  );

  return createResumeResponse(viewUrl, downloadUrl, {
    originalName: profile.resumeOriginalName,
    mimeType: profile.resumeMimeType,
    size: profile.resumeSize,
  });
};

export const getApplicationResumeDownloadUrl = async (
  requester,
  applicationId
) => {
  if (!mongoose.isValidObjectId(applicationId)) {
    throw createError("Invalid application ID.", 400);
  }

  const application = await Application.findById(applicationId)
    .select(
      "applicant recruiter resumePublicId resumeOriginalName resumeMimeType resumeSize status"
    )
    .lean();

  if (!application) {
    throw createError("Application not found.", 404);
  }

  const applicantId = String(application.applicant);
  const recruiterId = String(application.recruiter);
  const requesterId = String(requester.id);

  const isApplicant =
    requester.role === "APPLICANT" &&
    requesterId === applicantId;

  const isRecruiter =
    requester.role === "RECRUITER" &&
    requesterId === recruiterId;

  if (!isApplicant && !isRecruiter) {
    throw createError(
      "You are not authorized to access this application resume.",
      403
    );
  }

  // Recruiters cannot access resumes belonging to withdrawn applications.
  // Applicants can still access their own previously submitted resume.
  if (isRecruiter && application.status === "WITHDRAWN") {
    throw createError(
      "Resume access is unavailable for withdrawn applications.",
      403
    );
  }

  if (!application.resumePublicId) {
    throw createError(
      "No resume was attached to this application.",
      404
    );
  }

  // const downloadUrl = generateResumeDownloadUrl(
  //   application.resumePublicId
  // );

  // return createResumeResponse(downloadUrl, {
  //   originalName: application.resumeOriginalName,
  //   mimeType: application.resumeMimeType,
  //   size: application.resumeSize,
  // });
  // Generate separate temporary URLs for viewing and downloading.
const viewUrl = generateResumeDownloadUrl(
  application.resumePublicId,
  false
);

const downloadUrl = generateResumeDownloadUrl(
  application.resumePublicId,
  true
);

return {
  viewUrl,
  downloadUrl,
  expiresInSeconds: 300,
  resume: {
    originalName: application.resumeOriginalName,
    mimeType: application.resumeMimeType,
    size: application.resumeSize,
  },
};
};

export const getJobApplicationResumeForAI = async (
  recruiterId,
  jobId,
  applicationId
) => {
  if (
    !mongoose.isValidObjectId(recruiterId) ||
    !mongoose.isValidObjectId(jobId) ||
    !mongoose.isValidObjectId(applicationId)
  ) {
    throw createError("Invalid recruiter, job, or application ID.", 400);
  }

  const application = await Application.findOne({
    _id: applicationId,
    job: jobId,
    recruiter: recruiterId,
    // status: { $ne: "WITHDRAWN" },
  })
    .select(
      "_id applicant job recruiter status resumePublicId resumeOriginalName resumeMimeType resumeSize"
    )
    .lean();

  if (!application) {
    throw createError(
      "Application not found, inaccessible, or withdrawn.",
      404
    );
  }

  if (!application.resumePublicId) {
    throw createError("This application does not have a resume.", 404);
  }

  const downloadUrl = await generateResumeDownloadUrl(
    application.resumePublicId
  );

  return {
    applicationId: application._id,
    applicantId: application.applicant,
    resume: {
      downloadUrl,
      originalName: application.resumeOriginalName || "",
      mimeType: application.resumeMimeType || "",
      size: application.resumeSize || 0,
    },
  };
};

export const extractJobApplicationResumeTextForAI = async (
  recruiterId,
  jobId,
  applicationId
) => {
  const resumeData = await getJobApplicationResumeForAI(
    recruiterId,
    jobId,
    applicationId
  );

  const response = await fetch(resumeData.resume.downloadUrl);

  if (!response.ok) {
    throw createError("Unable to retrieve the applicant's resume.", 502);
  }

  const contentLength = Number(response.headers.get("content-length") || 0);

  if (contentLength > 5 * 1024 * 1024) {
    throw createError("Resume exceeds the allowed file size.", 413);
  }

  const buffer = Buffer.from(await response.arrayBuffer());

  if (buffer.length > 5 * 1024 * 1024) {
    throw createError("Resume exceeds the allowed file size.", 413);
  }

  if (buffer.length < 5 || buffer.toString("ascii", 0, 5) !== "%PDF-") {
    throw createError("The applicant's resume is not a valid PDF.", 422);
  }

  // const parser = new PDFParse({ data: buffer });

  const parser = new PDFParse({
  data: new Uint8Array(buffer),
  CanvasFactory,
});

  try {
    const result = await parser.getText();

    const extractedText = result.text
      .replace(/\u0000/g, "")
      .trim();

    if (!extractedText) {
      throw createError(
        "No readable text was found in this resume.",
        422
      );
    }

    return {
      applicationId: resumeData.applicationId,
      applicantId: resumeData.applicantId,
      originalName: resumeData.resume.originalName,
      text: extractedText.slice(0, 30000),
      truncated: extractedText.length > 30000,
    };
  } finally {
    await parser.destroy();
  }
};