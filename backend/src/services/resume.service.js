import { Readable } from "node:stream";
import { randomUUID } from "node:crypto";

import cloudinary from "../config/cloudinary.js";
import ApplicantProfile from "../models/ApplicantProfile.js";
import Application from "../models/Application.js";

const createError = (message, statusCode = 500) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

// Upload a buffer to Cloudinary using a stream.
const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: "raw",
        type: "private",
        folder: "talenthub/resumes",
        public_id: `${randomUUID()}.pdf`,
            //  filename_override: originalName,
        overwrite: false,
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }

        resolve(result);
      }
    );

    Readable.from(fileBuffer).pipe(uploadStream);
  });
};

// Delete an existing private resume from Cloudinary.
const deleteFromCloudinary = async (publicId) => {
  if (!publicId) return;

  return cloudinary.uploader.destroy(publicId, {
    resource_type: "raw",
    type: "private",
  });
};

// Delete a resume only if no application references it.
const deleteResumeIfUnused = async (publicId) => {
  if (!publicId) return;

  const existingApplication = await Application.exists({
    resumePublicId: publicId,
  });

  if (existingApplication) {
    return false;
  }

  await deleteFromCloudinary(publicId);

  return true;
};

export const uploadApplicantResume = async (applicantId, file) => {
  const profile = await ApplicantProfile.findOne({
    user: applicantId,
  });

  if (!profile) {
    throw createError(
      "Applicant profile not found. Please complete your profile first.",
      404
    );
  }

  const previousPublicId = profile.resumePublicId;

  let uploadedFile;

  try {
    uploadedFile = await uploadToCloudinary(file.buffer);

    profile.resumeUrl = "";
    profile.resumePublicId = uploadedFile.public_id;
    profile.resumeOriginalName = file.originalname;
    profile.resumeMimeType = file.mimetype;
    profile.resumeSize = file.size;

    await profile.save();
  } catch (error) {
    // Clean up the newly uploaded file if profile saving fails.
    if (uploadedFile?.public_id) {
      try {
        await deleteFromCloudinary(uploadedFile.public_id);
      } catch (cleanupError) {
        console.error(
          "Failed to clean up newly uploaded resume:",
          cleanupError.message
        );
      }
    }

    if (error.statusCode) {
      throw error;
    }

    console.error("Resume upload failed:", error.message);

    throw createError(
      "Unable to upload your resume right now. Please try again later.",
      503
    );
  }

  // Preserve the previous resume if an application references it.
  if (previousPublicId) {
    try {
      await deleteResumeIfUnused(previousPublicId);
    } catch (error) {
      console.error(
        "Failed to clean up previous resume:",
        error.message
      );
    }
  }

  return {
    resume: {
      originalName: profile.resumeOriginalName,
      mimeType: profile.resumeMimeType,
      size: profile.resumeSize,
      uploadedAt: profile.updatedAt,
    },
  };
};

export const removeApplicantResume = async (applicantId) => {
  const profile = await ApplicantProfile.findOne({
    user: applicantId,
  });

  if (!profile) {
    throw createError("Applicant profile not found.", 404);
  }

  if (!profile.resumePublicId && !profile.resumeUrl) {
    throw createError("No resume is currently uploaded.", 404);
  }

  const previousPublicId = profile.resumePublicId;

  // Clear resume metadata from the applicant's profile.
  profile.resumeUrl = "";
  profile.resumePublicId = "";
  profile.resumeOriginalName = "";
  profile.resumeMimeType = "";
  profile.resumeSize = 0;

  await profile.save();

  let cleanupPending = false;
  let retainedForApplications = false;

  if (previousPublicId) {
    try {
      const deleted = await deleteResumeIfUnused(previousPublicId);

      retainedForApplications = deleted === false;
    } catch (error) {
      cleanupPending = true;

      console.error(
        "Cloudinary resume cleanup failed:",
        error.message
      );
    }
  }

  return {
    removed: true,
    cleanupPending,
    retainedForApplications,
  };
};
