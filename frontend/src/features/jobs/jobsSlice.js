 

import { createSlice } from "@reduxjs/toolkit";

import {
  fetchFeaturedJobsThunk,
  fetchRecentJobsThunk,
  fetchJobsThunk,
  fetchJobDetailsThunk,
  fetchSimilarJobsThunk,
} from "./jobsThunks";

const initialState = {
  // Featured jobs
  featuredJobs: [],
  hasFetchedFeatured: false,
  isFeaturedLoading: false,
  featuredError: null,

  // Recent jobs
  recentJobs: [],
  hasFetchedRecent: false,
  isRecentLoading: false,
  recentError: null,

  // Search and filtered jobs
  searchResults: [],
  pagination: null,
  isSearchLoading: false,
  searchError: null,
  currentSearchRequestId: null,

  // Single job details
  jobDetails: null,
  isJobDetailsLoading: false,
  jobDetailsError: null,

  // Similar jobs
  similarJobs: [],
  isSimilarJobsLoading: false,
  similarJobsError: null,
};

const jobsSlice = createSlice({
  name: "jobs",
  initialState,

  reducers: {
    clearJobsErrors: (state) => {
      state.featuredError = null;
      state.recentError = null;
      state.searchError = null;
      state.jobDetailsError = null;
      state.similarJobsError = null;
    },

    clearSearchResults: (state) => {
      state.searchResults = [];
      state.pagination = null;
      state.searchError = null;
    },

    clearJobDetails: (state) => {
      state.jobDetails = null;
      state.jobDetailsError = null;
    },

    clearSimilarJobs: (state) => {
      state.similarJobs = [];
      state.similarJobsError = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // Featured jobs
      .addCase(fetchFeaturedJobsThunk.pending, (state) => {
        state.isFeaturedLoading = true;
        state.featuredError = null;
      })
      .addCase(fetchFeaturedJobsThunk.fulfilled, (state, action) => {
        state.isFeaturedLoading = false;
        state.hasFetchedFeatured = true;
        state.featuredJobs = action.payload.data?.jobs || [];
      })
      .addCase(fetchFeaturedJobsThunk.rejected, (state, action) => {
        state.isFeaturedLoading = false;
        state.featuredError =
          action.payload || "Unable to load featured jobs.";
      })

      // Recent jobs
      .addCase(fetchRecentJobsThunk.pending, (state) => {
        state.isRecentLoading = true;
        state.recentError = null;
      })
      .addCase(fetchRecentJobsThunk.fulfilled, (state, action) => {
        state.isRecentLoading = false;
        state.hasFetchedRecent = true;
        state.recentJobs = action.payload.data?.jobs || [];
      })
      .addCase(fetchRecentJobsThunk.rejected, (state, action) => {
        state.isRecentLoading = false;
        state.recentError =
          action.payload || "Unable to load recent jobs.";
      })

      // Search and filtered jobs
      // .addCase(fetchJobsThunk.pending, (state) => {
      //   state.isSearchLoading = true;
      //   state.searchError = null;
      // })
      // .addCase(fetchJobsThunk.fulfilled, (state, action) => {
      //   state.isSearchLoading = false;
      //   state.searchResults = action.payload.data?.jobs || [];
      //   state.pagination = action.payload.data?.pagination || null;
      // })
      // .addCase(fetchJobsThunk.rejected, (state, action) => {
      //   state.isSearchLoading = false;
      //   state.searchError =
      //     action.payload || "Unable to load jobs. Please try again.";
      // })
// Search and filtered jobs
.addCase(fetchJobsThunk.pending, (state, action) => {
  state.isSearchLoading = true;
  state.searchError = null;
  state.currentSearchRequestId = action.meta.requestId;
})

.addCase(fetchJobsThunk.fulfilled, (state, action) => {
  // Ignore responses from older search requests.
  if (state.currentSearchRequestId !== action.meta.requestId) {
    return;
  }

  state.isSearchLoading = false;
  state.currentSearchRequestId = null;

  state.searchResults = action.payload.data?.jobs || [];
  state.pagination = action.payload.data?.pagination || null;
})

.addCase(fetchJobsThunk.rejected, (state, action) => {
  // Ignore errors from older search requests.
  if (state.currentSearchRequestId !== action.meta.requestId) {
    return;
  }

  state.isSearchLoading = false;
  state.currentSearchRequestId = null;

  state.searchError =
    action.payload || "Unable to load jobs. Please try again.";
})
      // Single job details
      .addCase(fetchJobDetailsThunk.pending, (state) => {
        state.isJobDetailsLoading = true;
        state.jobDetailsError = null;
        state.jobDetails = null;
      })
      .addCase(fetchJobDetailsThunk.fulfilled, (state, action) => {
        state.isJobDetailsLoading = false;
        state.jobDetails =
          action.payload.data?.job ||
          action.payload.data ||
          null;
      })
      .addCase(fetchJobDetailsThunk.rejected, (state, action) => {
        state.isJobDetailsLoading = false;
        state.jobDetailsError =
          action.payload || "Unable to load job details.";
      })

      // Similar jobs
      .addCase(fetchSimilarJobsThunk.pending, (state) => {
        state.isSimilarJobsLoading = true;
        state.similarJobsError = null;
      })
      .addCase(fetchSimilarJobsThunk.fulfilled, (state, action) => {
        state.isSimilarJobsLoading = false;
        state.similarJobs = action.payload.data?.jobs || [];
      })
      .addCase(fetchSimilarJobsThunk.rejected, (state, action) => {
        state.isSimilarJobsLoading = false;
        state.similarJobsError =
          action.payload || "Unable to load similar jobs.";
      });
  },
});

export const {
  clearJobsErrors,
  clearSearchResults,
  clearJobDetails,
  clearSimilarJobs,
} = jobsSlice.actions;

export default jobsSlice.reducer;
