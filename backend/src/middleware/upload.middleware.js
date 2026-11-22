 

import multer from "multer";

const MAX_RESUME_SIZE = 5 * 1024 * 1024;

const createUploadError = (message, statusCode = 400) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

// Store uploaded files temporarily in memory.
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: MAX_RESUME_SIZE,
    files: 1,
  },
  fileFilter: (req, file, callback) => {
    if (file.mimetype !== "application/pdf") {
      return callback(
        createUploadError("Only PDF resume files are allowed.")
      );
    }

    callback(null, true);
  },
});

// Handle Multer errors with appropriate HTTP status codes.
export const uploadResume = (req, res, next) => {
  upload.single("resume")(req, res, (error) => {
    if (error) {
      if (error instanceof multer.MulterError) {
        error.statusCode =
          error.code === "LIMIT_FILE_SIZE" ? 413 : 400;
      }

      return next(error);
    }

    next();
  });
};

// Verify the actual PDF file signature.
export const validateResumeFile = (req, res, next) => {
  try {
    if (!req.file) {
      throw createUploadError(
        "Please upload a resume PDF file."
      );
    }

    if (!req.file.buffer || req.file.size === 0) {
      throw createUploadError(
        "The uploaded resume file is empty."
      );
    }

    const fileSignature = req.file.buffer
      .subarray(0, 5)
      .toString("ascii");

    if (fileSignature !== "%PDF-") {
      throw createUploadError(
        "Invalid PDF file. Please upload a valid PDF document."
      );
    }

    next();
  } catch (error) {
    next(error);
  }
};
