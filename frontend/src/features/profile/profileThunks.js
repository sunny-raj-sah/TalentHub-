
import { createAsyncThunk } from "@reduxjs/toolkit";

import {
  getMyProfile,
  updateMyProfile,
} from "../../api/profile.api";

const getErrorMessage = (error) => {
  const validationErrors = error.response?.data?.errors;

  if (validationErrors?.length) {
    return validationErrors
      .map((item) => item.message)
      .join(", ");
  }

  return (
    error.response?.data?.message ||
    error.message ||
    "Something went wrong. Please try again."
  );
};

// Fetch logged-in user's profile
export const fetchMyProfileThunk = createAsyncThunk(
  "profile/fetchMyProfile",
  async (_, { rejectWithValue }) => {
    try {
      return await getMyProfile();
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

// Update logged-in user's profile
export const updateMyProfileThunk = createAsyncThunk(
  "profile/updateMyProfile",
  async (profileData, { rejectWithValue }) => {
    try {
      return await updateMyProfile(profileData);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);
