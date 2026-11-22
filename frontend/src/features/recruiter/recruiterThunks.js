 
import { createAsyncThunk } from "@reduxjs/toolkit";

import {
  getRecruiterDashboard,
  getRecruiterJobs,
    getRecruiterApplicationDetails,
} from "../../api/recruiter.api";

import {
  getJobApplications,
  updateApplicationStatus,
} from "../../api/applications.api";


import {
  createJob,
  updateJob,
  archiveJob,
  restoreJob,
  deleteJob,
} from "../../api/jobs.api";

// Extract a useful backend error message.
const getErrorMessage = (error) => {
  return (
    error.response?.data?.message ||
    error.message ||
    "Something went wrong. Please try again."
  );
};

// Fetch recruiter dashboard statistics and recent applications.
export const fetchRecruiterDashboardThunk = createAsyncThunk(
  "recruiter/fetchDashboard",
  async (_, { rejectWithValue }) => {
    try {
      return await getRecruiterDashboard();
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

// Fetch recruiter's own jobs.
export const fetchRecruiterJobsThunk = createAsyncThunk(
  "recruiter/fetchJobs",
  async (params = {}, { rejectWithValue }) => {
    try {
      return await getRecruiterJobs(params);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

// Create a new recruiter job.
export const createRecruiterJobThunk = createAsyncThunk(
  "recruiter/createJob",
  async (jobData, { rejectWithValue }) => {
    try {
      return await createJob(jobData);
    } catch (error) {
      const backendError = error.response?.data;

      return rejectWithValue({
        message:
          backendError?.message ||
          error.message ||
          "Unable to create job. Please try again.",
        errors: backendError?.errors || [],
      });
    }
  }
);

// Update an existing recruiter job.
export const updateRecruiterJobThunk = createAsyncThunk(
  "recruiter/updateJob",
  async ({ jobId, jobData }, { rejectWithValue }) => {
    try {
      return await updateJob(jobId, jobData);
    } catch (error) {
      const backendError = error.response?.data;

      return rejectWithValue({
        message:
          backendError?.message ||
          error.message ||
          "Unable to update job. Please try again.",
        errors: backendError?.errors || [],
      });
    }
  }
);

// Archive an existing recruiter job.
export const archiveRecruiterJobThunk = createAsyncThunk(
  "recruiter/archiveJob",
  async (jobId, { rejectWithValue }) => {
    try {
      return await archiveJob(jobId);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

// Restore an archived recruiter job.
export const restoreRecruiterJobThunk = createAsyncThunk(
  "recruiter/restoreJob",
  async (jobId, { rejectWithValue }) => {
    try {
      return await restoreJob(jobId);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

// Permanently delete a recruiter job.
export const deleteRecruiterJobThunk = createAsyncThunk(
  "recruiter/deleteJob",
  async (jobId, { rejectWithValue }) => {
    try {
      return await deleteJob(jobId);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);



 
// Fetch applications for a recruiter's job.
export const fetchRecruiterJobApplicationsThunk = createAsyncThunk(
  "recruiter/fetchJobApplications",
  async ({ jobId, ...params }, { rejectWithValue }) => {
    try {
      return await getJobApplications(jobId, params);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

// Shortlist or reject an applicant.
export const updateRecruiterApplicationStatusThunk = createAsyncThunk(
  "recruiter/updateApplicationStatus",
  async ({ applicationId, status }, { rejectWithValue }) => {
    try {
      return await updateApplicationStatus(applicationId, status);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);


export const fetchRecruiterApplicationDetailsThunk = createAsyncThunk(
  "recruiter/fetchApplicationDetails",
  async ({ jobId, applicationId }, { rejectWithValue }) => {
    try {
      return await getRecruiterApplicationDetails(
        jobId,
        applicationId
      );
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);
