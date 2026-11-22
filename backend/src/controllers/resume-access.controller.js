 

// import {
//   getResumeDownloadUrl,
//   getApplicationResumeDownloadUrl,
// } from "../services/resume-access.service.js";

// // Create a safe Content-Disposition header using the original filename.
// const createAttachmentHeader = (originalName) => {
//   const filename =
//     String(originalName || "resume.pdf")
//       .replace(/[\r\n]/g, "")
//       .split(/[\\/]/)
//       .pop()
//       .trim() || "resume.pdf";

//   const fallbackFilename = filename
//     .replace(/[^\x20-\x7E]/g, "_")
//     .replace(/["\\]/g, "_");

//   return `attachment; filename="${fallbackFilename}"; filename*=UTF-8''${encodeURIComponent(filename)}`;
// };

// // Generate a temporary private download URL.
// export const downloadResume = async (req, res, next) => {
//   try {
//     const result = await getResumeDownloadUrl(
//       req.user,
//       req.params.applicantId
//     );

//     return res.status(200).json({
//       success: true,
//       message: "Resume download link generated successfully.",
//       data: result,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// // Download the actual resume with its original filename.
// export const downloadResumeFile = async (req, res, next) => {
//   try {
//     // Reuse the existing authorization and resume lookup.
//     const result = await getResumeDownloadUrl(
//       req.user,
//       req.params.applicantId
//     );

//     // Retrieve the private PDF from Cloudinary.
//     const cloudinaryResponse = await fetch(result.downloadUrl);

//     if (!cloudinaryResponse.ok) {
//       console.error(
//         "Cloudinary download failed:",
//         cloudinaryResponse.status
//       );

//       const error = new Error(
//         "Unable to retrieve your resume from cloud storage."
//       );
//       error.statusCode = 502;
//       throw error;
//     }

//     const fileBuffer = Buffer.from(
//       await cloudinaryResponse.arrayBuffer()
//     );

//     // Send the PDF with its original filename.
//     res.setHeader("Content-Type", "application/pdf");

//     res.setHeader(
//       "Content-Disposition",
//       createAttachmentHeader(result.resume.originalName)
//     );

//     res.setHeader("Content-Length", fileBuffer.length);
//     res.setHeader("Cache-Control", "private, no-store");

//     return res.status(200).send(fileBuffer);
//   } catch (error) {
//     next(error);
//   }
// };

// export const downloadApplicationResume = async (req, res, next) => {
//   try {
//     const result = await getApplicationResumeDownloadUrl(
//       req.user,
//       req.params.applicationId
//     );

//     return res.status(200).json({
//       success: true,
//       message: "Application resume download link generated successfully.",
//       data: result,
//     });
//   } catch (error) {
//     next(error);
//   }
// };
// ---------------------------------------------------------------------------------------------------

import {
  getResumeDownloadUrl,
  getApplicationResumeDownloadUrl,
} from "../services/resume-access.service.js";

// Create a safe Content-Disposition header using the original filename.
const createAttachmentHeader = (
  originalName,
  disposition = "attachment"
) => {
  const filename =
    String(originalName || "resume.pdf")
      .replace(/[\r\n]/g, "")
      .split(/[\\/]/)
      .pop()
      .trim() || "resume.pdf";

  const fallbackFilename = filename
    .replace(/[^\x20-\x7E]/g, "_")
    .replace(/["\\]/g, "_");

  return `${disposition}; filename="${fallbackFilename}"; filename*=UTF-8''${encodeURIComponent(filename)}`;
};

// Retrieve a private PDF from Cloudinary and send it to the client.
const sendResumeFile = async (res, downloadUrl, resume, disposition) => {
  const cloudinaryResponse = await fetch(downloadUrl);

  if (!cloudinaryResponse.ok) {
    console.error(
      "Cloudinary download failed:",
      cloudinaryResponse.status
    );

    const error = new Error(
      "Unable to retrieve the resume from cloud storage."
    );
    error.statusCode = 502;
    throw error;
  }

  const fileBuffer = Buffer.from(
    await cloudinaryResponse.arrayBuffer()
  );

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    createAttachmentHeader(resume.originalName, disposition)
  );
  res.setHeader("Content-Length", fileBuffer.length);
  res.setHeader("Cache-Control", "private, no-store");

  return res.status(200).send(fileBuffer);
};

// Generate a temporary private download URL.
export const downloadResume = async (req, res, next) => {
  try {
    const result = await getResumeDownloadUrl(
      req.user,
      req.params.applicantId
    );

    return res.status(200).json({
      success: true,
      message: "Resume download link generated successfully.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Download or view the applicant's current resume.
export const downloadResumeFile = async (req, res, next) => {
  try {
    const disposition =
      req.query.disposition === "inline" ? "inline" : "attachment";

    const result = await getResumeDownloadUrl(
      req.user,
      req.params.applicantId,
      disposition === "attachment"
    );

    return await sendResumeFile(
      res,
      result.downloadUrl,
      result.resume,
      disposition
    );
  } catch (error) {
    next(error);
  }
};

// Generate temporary URLs for an application resume snapshot.
export const downloadApplicationResume = async (req, res, next) => {
  try {
    const result = await getApplicationResumeDownloadUrl(
      req.user,
      req.params.applicationId
    );

    return res.status(200).json({
      success: true,
      message: "Application resume links generated successfully.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Download or view the exact resume snapshot attached to an application.
export const downloadApplicationResumeFile = async (req, res, next) => {
  try {
    const disposition =
      req.query.disposition === "inline" ? "inline" : "attachment";

    const result = await getApplicationResumeDownloadUrl(
      req.user,
      req.params.applicationId
    );

    const resumeUrl =
      disposition === "inline"
        ? result.viewUrl
        : result.downloadUrl;

    return await sendResumeFile(
      res,
      resumeUrl,
      result.resume,
      disposition
    );
  } catch (error) {
    next(error);
  }
};
