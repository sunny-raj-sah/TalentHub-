 
import { createAsyncThunk } from "@reduxjs/toolkit";

import {
  getMyApplications,
  getApplicationById,
  withdrawApplication,
} from "../../api/applications.api";

// Extract a useful backend error message
const getErrorMessage = (error) => {
  return (
    error.response?.data?.message ||
    error.message ||
    "Something went wrong. Please try again."
  );
};

// Fetch applicant applications
export const fetchMyApplicationsThunk = createAsyncThunk(
  "applications/fetchMyApplications",
  async (params = {}, { rejectWithValue }) => {
    try {
      return await getMyApplications(params);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

// Fetch application details
export const fetchApplicationByIdThunk = createAsyncThunk(
  "applications/fetchApplicationById",
  async (applicationId, { rejectWithValue }) => {
    try {
      return await getApplicationById(applicationId);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

// Withdraw application
export const withdrawApplicationThunk = createAsyncThunk(
  "applications/withdrawApplication",
  async (applicationId, { rejectWithValue }) => {
    try {
      return await withdrawApplication(applicationId);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);
