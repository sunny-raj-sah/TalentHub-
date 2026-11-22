 
import api from "./axios";

// Applicant applies for a job.
export const applyForJob = async (jobId, applicationData = {}) => {
  const response = await api.post(
    `/applications/${jobId}`,
    applicationData
  );

  return response.data;
};

// Applicant fetches their applications.
export const getMyApplications = async (params = {}) => {
  const response = await api.get("/applications/my-applications", {
    params,
  });

  return response.data;
};

// Applicant fetches application details.
export const getApplicationById = async (applicationId) => {
  const response = await api.get(`/applications/${applicationId}`);
  return response.data;
};

// Applicant withdraws an application.
export const withdrawApplication = async (applicationId) => {
  const response = await api.patch(
    `/applications/${applicationId}/withdraw`
  );

  return response.data;
};

// Recruiter fetches applicants for a particular job.
export const getJobApplications = async (jobId, params = {}) => {
  const response = await api.get(
    `/applications/job/${jobId}`,
    { params }
  );

  return response.data;
};

// Recruiter updates an applicant's status.
export const updateApplicationStatus = async (
  applicationId,
  status
) => {
  const response = await api.patch(
    `/applications/${applicationId}/status`,
    { status }
  );

  return response.data;
};
