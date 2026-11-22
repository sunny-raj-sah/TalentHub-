import axios from "axios";
import { getAccessToken } from "./axios";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Dedicated Axios instance for resume operations.
const resumeApi = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Attach the current access token to resume requests.
resumeApi.interceptors.request.use(
  (config) => {
    const accessToken = getAccessToken();

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Upload or replace the applicant's resume.
export const uploadMyResume = async (file) => {
  const formData = new FormData();
  formData.append("resume", file);

  const response = await resumeApi.post("/resume/upload", formData);
  return response.data;
};

// Get a temporary private download URL.
export const getResumeDownloadUrl = async (applicantId) => {
  const response = await resumeApi.get(
    `/resume/download/${applicantId}`
  );

  return response.data;
};

// Remove the applicant's current resume.
export const removeMyResume = async () => {
  const response = await resumeApi.delete("/resume");
  return response.data;
};

// Download the resume snapshot attached to an application.
export const getApplicationResumeDownloadUrl = async (applicationId) => {
  const response = await resumeApi.get(
    `/resume/application/${applicationId}`
  );

  return response.data;
};


// Download the actual resume PDF with its original filename.
// export const downloadMyResumeFile = async (applicantId) => {
//   const response = await resumeApi.get(
//     `/resume/download/${applicantId}/file`,
//     {
//       responseType: "blob",
//     }
//   );

//   return response;
// };


// Download or view the applicant's current resume as a PDF Blob.
export const downloadMyResumeFile = async (
  applicantId,
  disposition = "attachment"
) => {
  return resumeApi.get(
    `/resume/download/${applicantId}/file`,
    {
      params: { disposition },
      responseType: "blob",
    }
  );
};

// Download or view the exact resume snapshot attached to an application.
export const downloadApplicationResumeFile = async (
  applicationId,
  disposition = "attachment"
) => {
  return resumeApi.get(
    `/resume/application/${applicationId}/file`,
    {
      params: { disposition },
      responseType: "blob",
    }
  );
};
