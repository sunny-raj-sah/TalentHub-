 
import { createAsyncThunk } from "@reduxjs/toolkit";

import {
  getFeaturedJobs,
  getRecentJobs,
  getJobs,
  getJobById, getSimilarJobs,
} from "../../api/jobs.api";

const getErrorMessage = (error) => {
  return (
    error.response?.data?.message ||
    error.message ||
    "Unable to load jobs. Please try again."
  );
};

export const fetchFeaturedJobsThunk = createAsyncThunk(
  "jobs/fetchFeatured",
  async (_, { rejectWithValue }) => {
    try {
      return await getFeaturedJobs();
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
  {
    condition: (_, { getState }) => {
      const {
        isFeaturedLoading,
        hasFetchedFeatured,
      } = getState().jobs;

      return !isFeaturedLoading && !hasFetchedFeatured;
    },
  }
);

export const fetchRecentJobsThunk = createAsyncThunk(
  "jobs/fetchRecent",
  async (_, { rejectWithValue }) => {
    try {
      return await getRecentJobs();
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
  {
    condition: (_, { getState }) => {
      const {
        isRecentLoading,
        hasFetchedRecent,
      } = getState().jobs;

      return !isRecentLoading && !hasFetchedRecent;
    },
  }
);

export const fetchJobsThunk = createAsyncThunk(
  "jobs/fetchJobs",
  async (params = {}, { rejectWithValue }) => {
    try {
      return await getJobs(params);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);
export const fetchJobDetailsThunk = createAsyncThunk(
  "jobs/fetchJobDetails",
  async (jobId, { rejectWithValue }) => {
    try {
      return await getJobById(jobId);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const fetchSimilarJobsThunk = createAsyncThunk(
  "jobs/fetchSimilarJobs",
  async (jobId, { rejectWithValue }) => {
    try {
      return await getSimilarJobs(jobId);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);