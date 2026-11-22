
import { createAsyncThunk } from "@reduxjs/toolkit";

import {
  getMyBookmarks,
  addBookmark,
  removeBookmark,
} from "../../api/bookmarks.api";

const getErrorMessage = (error) => {
  return (
    error.response?.data?.message ||
    error.message ||
    "Something went wrong. Please try again."
  );
};

// Fetch applicant bookmarks.
export const fetchMyBookmarksThunk = createAsyncThunk(
  "bookmarks/fetchMyBookmarks",
  async (params = {}, { rejectWithValue }) => {
    try {
      return await getMyBookmarks(params);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

// Add a job to bookmarks.
export const addBookmarkThunk = createAsyncThunk(
  "bookmarks/addBookmark",
  async (jobId, { rejectWithValue }) => {
    try {
      const response = await addBookmark(jobId);

      return {
        jobId,
        bookmark: response.data?.bookmark,
        message: response.message,
      };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

// Remove a job from bookmarks.
export const removeBookmarkThunk = createAsyncThunk(
  "bookmarks/removeBookmark",
  async (jobId, { rejectWithValue }) => {
    try {
      const response = await removeBookmark(jobId);

      return {
        jobId,
        message: response.message,
      };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);
