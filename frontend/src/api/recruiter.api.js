
import api from "./axios";

// Fetch recruiter dashboard statistics and recent applications.
export const getRecruiterDashboard = async () => {
  const response = await api.get("/recruiter/dashboard");

  return response.data;
};

// Fetch recruiter's own jobs.
export const getRecruiterJobs = async (params = {}) => {
  const response = await api.get("/recruiter/jobs", {
    params,
  });

  return response.data;
};



export const getRecruiterApplicationDetails = async (
  jobId,
  applicationId
) => {
  const response = await api.get(
    `/applications/job/${jobId}/applications/${applicationId}`
  );

  return response.data;
};
