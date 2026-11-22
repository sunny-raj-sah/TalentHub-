 

import api from "./axios";

// Create a new job.
export const createJob = async (jobData) => {
  const response = await api.post("/jobs", jobData);
  return response.data;
};

// Update an existing job.
export const updateJob = async (jobId, jobData) => {
  const response = await api.put(`/jobs/${jobId}`, jobData);
  return response.data;
};

// Archive an existing job.
export const archiveJob = async (jobId) => {
  const response = await api.patch(`/jobs/${jobId}/archive`);
  return response.data;
};

// Restore an archived job.
export const restoreJob = async (jobId) => {
  const response = await api.patch(`/jobs/${jobId}/restore`);
  return response.data;
};

// Permanently delete a job.
export const deleteJob = async (jobId) => {
  const response = await api.delete(`/jobs/${jobId}`);
  return response.data;
};

// Fetch featured jobs.
export const getFeaturedJobs = async () => {
  const response = await api.get("/jobs/featured");
  return response.data;
};

// Fetch recently posted jobs.
export const getRecentJobs = async () => {
  const response = await api.get("/jobs/recent");
  return response.data;
};

// Fetch jobs with search filters and pagination.
export const getJobs = async (params = {}) => {
  const response = await api.get("/jobs", { params });
  return response.data;
};

// Fetch an individual job.
export const getJobById = async (jobId) => {
  const response = await api.get(`/jobs/${jobId}`);
  return response.data;
};

// Fetch similar jobs.
export const getSimilarJobs = async (jobId) => {
  const response = await api.get(`/jobs/${jobId}/similar`);
  return response.data;
};
