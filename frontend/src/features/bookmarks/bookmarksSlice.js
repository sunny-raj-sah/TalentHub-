
import { createSlice } from "@reduxjs/toolkit";

import {
  fetchMyBookmarksThunk,
  addBookmarkThunk,
  removeBookmarkThunk,
} from "./bookmarksThunks";

const initialState = {
  bookmarks: [],
  pagination: null,

  isLoading: false,
  isAdding: false,
  removingJobIds: [],

  error: null,
  addError: null,
  removeError: null,
  successMessage: null,
};

const bookmarksSlice = createSlice({
  name: "bookmarks",
  initialState,

  reducers: {
    clearBookmarksError: (state) => {
      state.error = null;
    },

    clearBookmarkFeedback: (state) => {
      state.addError = null;
      state.removeError = null;
      state.successMessage = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // Fetch bookmarks
      .addCase(fetchMyBookmarksThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMyBookmarksThunk.fulfilled, (state, action) => {
        state.isLoading = false;

        state.bookmarks =
          action.payload.data?.bookmarks || [];

        state.pagination =
          action.payload.data?.pagination || null;
      })
      .addCase(fetchMyBookmarksThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.payload || "Unable to fetch saved jobs.";
      })

      // Add bookmark
      .addCase(addBookmarkThunk.pending, (state) => {
        state.isAdding = true;
        state.addError = null;
        state.successMessage = null;
      })
      .addCase(addBookmarkThunk.fulfilled, (state, action) => {
        state.isAdding = false;

        const bookmark = action.payload.bookmark;

        if (
          bookmark &&
          !state.bookmarks.some(
            (item) => item.job?._id === bookmark.job
          )
        ) {
          state.bookmarks.unshift(bookmark);
        }

        state.successMessage =
          action.payload.message || "Job bookmarked successfully.";
      })
      .addCase(addBookmarkThunk.rejected, (state, action) => {
        state.isAdding = false;
        state.addError =
          action.payload || "Unable to bookmark this job.";
      })

      // Remove bookmark
      .addCase(removeBookmarkThunk.pending, (state, action) => {
        const jobId = action.meta.arg;

        if (!state.removingJobIds.includes(jobId)) {
          state.removingJobIds.push(jobId);
        }

        state.removeError = null;
        state.successMessage = null;
      })
      .addCase(removeBookmarkThunk.fulfilled, (state, action) => {
        const { jobId, message } = action.payload;

        state.removingJobIds = state.removingJobIds.filter(
          (id) => id !== jobId
        );

        state.bookmarks = state.bookmarks.filter(
          (bookmark) => bookmark.job?._id !== jobId
        );

        if (state.pagination) {
          state.pagination.totalBookmarks = Math.max(
            0,
            state.pagination.totalBookmarks - 1
          );
        }

        state.successMessage =
          message || "Bookmark removed successfully.";
      })
      .addCase(removeBookmarkThunk.rejected, (state, action) => {
        const jobId = action.meta.arg;

        state.removingJobIds = state.removingJobIds.filter(
          (id) => id !== jobId
        );

        state.removeError =
          action.payload || "Unable to remove this bookmark.";
      });
  },
});

export const {
  clearBookmarksError,
  clearBookmarkFeedback,
} = bookmarksSlice.actions;

export default bookmarksSlice.reducer;
