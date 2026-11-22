
import { createSlice } from "@reduxjs/toolkit";

import {
  fetchMyApplicationsThunk,
  fetchApplicationByIdThunk,
  withdrawApplicationThunk,
} from "./applicationsThunks";

const initialState = {
  applications: [],
  pagination: null,
  selectedApplication: null,

  isLoading: false,
  isDetailsLoading: false,
  isWithdrawing: false,

  error: null,
  detailsError: null,
  withdrawError: null,
  withdrawSuccess: null,
};

const applicationsSlice = createSlice({
  name: "applications",
  initialState,

  reducers: {
    clearApplicationsError: (state) => {
      state.error = null;
    },

    clearApplicationDetails: (state) => {
      state.selectedApplication = null;
      state.detailsError = null;
    },

    clearWithdrawFeedback: (state) => {
      state.withdrawError = null;
      state.withdrawSuccess = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // Fetch applicant applications
      .addCase(fetchMyApplicationsThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMyApplicationsThunk.fulfilled, (state, action) => {
        state.isLoading = false;

        state.applications =
          action.payload.data?.applications || [];

        state.pagination =
          action.payload.data?.pagination || null;
      })
      .addCase(fetchMyApplicationsThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Unable to fetch applications.";
      })

      // Fetch application details
      .addCase(fetchApplicationByIdThunk.pending, (state) => {
        state.isDetailsLoading = true;
        state.detailsError = null;
        state.selectedApplication = null;
      })
      .addCase(fetchApplicationByIdThunk.fulfilled, (state, action) => {
        state.isDetailsLoading = false;
        state.selectedApplication =
          action.payload.data?.application || null;
      })
      .addCase(fetchApplicationByIdThunk.rejected, (state, action) => {
        state.isDetailsLoading = false;
        state.detailsError =
          action.payload || "Unable to fetch application details.";
      })

      // Withdraw application
      .addCase(withdrawApplicationThunk.pending, (state) => {
        state.isWithdrawing = true;
        state.withdrawError = null;
        state.withdrawSuccess = null;
      })
      .addCase(withdrawApplicationThunk.fulfilled, (state, action) => {
        state.isWithdrawing = false;

        const updatedApplication =
          action.payload.data?.application;

        if (!updatedApplication) return;

        state.applications = state.applications.map((application) =>
          application._id === updatedApplication._id
            ? updatedApplication
            : application
        );

        if (
          state.selectedApplication?._id ===
          updatedApplication._id
        ) {
          state.selectedApplication = updatedApplication;
        }

        state.withdrawSuccess =
          action.payload.message || "Application withdrawn successfully.";
      })
      .addCase(withdrawApplicationThunk.rejected, (state, action) => {
        state.isWithdrawing = false;
        state.withdrawError =
          action.payload || "Unable to withdraw application.";
      });
  },
});

export const {
  clearApplicationsError,
  clearApplicationDetails,
  clearWithdrawFeedback,
} = applicationsSlice.actions;

export default applicationsSlice.reducer;
