import { createSlice } from "@reduxjs/toolkit";

import {
  fetchRecruiterDashboardThunk,
  fetchRecruiterJobsThunk,
  createRecruiterJobThunk,
  updateRecruiterJobThunk,
  archiveRecruiterJobThunk,
  restoreRecruiterJobThunk,
  deleteRecruiterJobThunk,
  fetchRecruiterJobApplicationsThunk,
  updateRecruiterApplicationStatusThunk,
    fetchRecruiterApplicationDetailsThunk,

} from "./recruiterThunks";

const initialState = {
  // Dashboard
  dashboard: null,
  isDashboardLoading: false,
  dashboardError: null,

  // Recruiter jobs
  jobsData: null,
  isJobsLoading: false,
  jobsError: null,

  // Create job
  isCreatingJob: false,
  createJobError: null,
  createdJob: null,

  // Update job
  isUpdatingJob: false,
  updateJobError: null,
  updatedJob: null,

  // Archive job
  isArchivingJob: false,
  archiveJobError: null,
  archivedJob: null,

  // Restore job
  isRestoringJob: false,
  restoreJobError: null,
  restoredJob: null,

  // Delete job
  isDeletingJob: false,
  deleteJobError: null,
  deletedJobId: null,

  // Recruiter job applications
  jobApplicationsData: null,
  isJobApplicationsLoading: false,
  jobApplicationsError: null,

  // Update application status
  isUpdatingApplicationStatus: false,
  updatingApplicationId: null,
  updateApplicationStatusError: null,
  updatedApplication: null,

    // Recruiter application details
  applicationDetails: null,
  isApplicationDetailsLoading: false,
  applicationDetailsError: null,

};

const recruiterSlice = createSlice({
  name: "recruiter",
  initialState,

  reducers: {
    clearRecruiterDashboardError: (state) => {
      state.dashboardError = null;
    },

    clearRecruiterJobsError: (state) => {
      state.jobsError = null;
    },

    clearCreateJobError: (state) => {
      state.createJobError = null;
    },

    clearCreatedJob: (state) => {
      state.createdJob = null;
    },

    clearUpdateJobError: (state) => {
      state.updateJobError = null;
    },

    clearUpdatedJob: (state) => {
      state.updatedJob = null;
    },

    clearArchiveJobError: (state) => {
      state.archiveJobError = null;
    },

    clearArchivedJob: (state) => {
      state.archivedJob = null;
    },

    clearRestoreJobError: (state) => {
      state.restoreJobError = null;
    },

    clearRestoredJob: (state) => {
      state.restoredJob = null;
    },

    clearDeleteJobError: (state) => {
      state.deleteJobError = null;
    },

    clearDeletedJob: (state) => {
      state.deletedJobId = null;
    },

    // Recruiter application actions
    clearJobApplicationsError: (state) => {
      state.jobApplicationsError = null;
    },

    clearUpdateApplicationStatusError: (state) => {
      state.updateApplicationStatusError = null;
    },

    clearUpdatedApplication: (state) => {
      state.updatedApplication = null;
    },
        clearApplicationDetails: (state) => {
      state.applicationDetails = null;
      state.applicationDetailsError = null;
    },

    clearApplicationDetailsError: (state) => {
      state.applicationDetailsError = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // Fetch recruiter dashboard
      .addCase(fetchRecruiterDashboardThunk.pending, (state) => {
        state.isDashboardLoading = true;
        state.dashboardError = null;
      })
      .addCase(fetchRecruiterDashboardThunk.fulfilled, (state, action) => {
        state.isDashboardLoading = false;
        state.dashboard = action.payload.data || null;
      })
      .addCase(fetchRecruiterDashboardThunk.rejected, (state, action) => {
        state.isDashboardLoading = false;
        state.dashboardError =
          action.payload || "Unable to fetch recruiter dashboard.";
      })

      // Fetch recruiter jobs
      .addCase(fetchRecruiterJobsThunk.pending, (state) => {
        state.isJobsLoading = true;
        state.jobsError = null;
      })
      .addCase(fetchRecruiterJobsThunk.fulfilled, (state, action) => {
        state.isJobsLoading = false;
        state.jobsData = action.payload.data || null;
      })
      .addCase(fetchRecruiterJobsThunk.rejected, (state, action) => {
        state.isJobsLoading = false;
        state.jobsError =
          action.payload || "Unable to fetch recruiter jobs.";
      })

      // Create recruiter job
      .addCase(createRecruiterJobThunk.pending, (state) => {
        state.isCreatingJob = true;
        state.createJobError = null;
        state.createdJob = null;
      })
      .addCase(createRecruiterJobThunk.fulfilled, (state, action) => {
        state.isCreatingJob = false;
        state.createdJob = action.payload.data?.job || null;
      })
      .addCase(createRecruiterJobThunk.rejected, (state, action) => {
        state.isCreatingJob = false;
        state.createJobError =
          action.payload?.message ||
          "Unable to create job. Please try again.";
      })

      // Update recruiter job
      .addCase(updateRecruiterJobThunk.pending, (state) => {
        state.isUpdatingJob = true;
        state.updateJobError = null;
        state.updatedJob = null;
      })
      .addCase(updateRecruiterJobThunk.fulfilled, (state, action) => {
        state.isUpdatingJob = false;
        state.updatedJob = action.payload.data?.job || null;
      })
      .addCase(updateRecruiterJobThunk.rejected, (state, action) => {
        state.isUpdatingJob = false;
        state.updateJobError =
          action.payload?.message ||
          "Unable to update job. Please try again.";
      })

      // Archive recruiter job
      .addCase(archiveRecruiterJobThunk.pending, (state) => {
        state.isArchivingJob = true;
        state.archiveJobError = null;
        state.archivedJob = null;
      })
      .addCase(archiveRecruiterJobThunk.fulfilled, (state, action) => {
        state.isArchivingJob = false;
        state.archivedJob = action.payload.data?.job || null;
      })
      .addCase(archiveRecruiterJobThunk.rejected, (state, action) => {
        state.isArchivingJob = false;
        state.archiveJobError =
          action.payload || "Unable to archive job. Please try again.";
      })

      // Restore recruiter job
      .addCase(restoreRecruiterJobThunk.pending, (state) => {
        state.isRestoringJob = true;
        state.restoreJobError = null;
        state.restoredJob = null;
      })
      .addCase(restoreRecruiterJobThunk.fulfilled, (state, action) => {
        state.isRestoringJob = false;
        state.restoredJob = action.payload.data?.job || null;
      })
      .addCase(restoreRecruiterJobThunk.rejected, (state, action) => {
        state.isRestoringJob = false;
        state.restoreJobError =
          action.payload || "Unable to restore job. Please try again.";
      })

      // Delete recruiter job
      .addCase(deleteRecruiterJobThunk.pending, (state) => {
        state.isDeletingJob = true;
        state.deleteJobError = null;
        state.deletedJobId = null;
      })
      .addCase(deleteRecruiterJobThunk.fulfilled, (state, action) => {
        state.isDeletingJob = false;
        state.deletedJobId = action.meta.arg;
      })
      .addCase(deleteRecruiterJobThunk.rejected, (state, action) => {
        state.isDeletingJob = false;
        state.deleteJobError =
          action.payload || "Unable to delete job. Please try again.";
      })

      // Fetch applications for a recruiter's job
      .addCase(fetchRecruiterJobApplicationsThunk.pending, (state) => {
        state.isJobApplicationsLoading = true;
        state.jobApplicationsError = null;
      })
      .addCase(
        fetchRecruiterJobApplicationsThunk.fulfilled,
        (state, action) => {
          state.isJobApplicationsLoading = false;
          state.jobApplicationsData = action.payload.data || null;
        }
      )
      .addCase(
        fetchRecruiterJobApplicationsThunk.rejected,
        (state, action) => {
          state.isJobApplicationsLoading = false;
          state.jobApplicationsError =
            action.payload || "Unable to fetch job applications.";
        }
      )

      // Update application status
      .addCase(updateRecruiterApplicationStatusThunk.pending, (state, action) => {
        state.isUpdatingApplicationStatus = true;
        state.updatingApplicationId = action.meta.arg.applicationId;
        state.updateApplicationStatusError = null;
        state.updatedApplication = null;
      })
      .addCase(
        updateRecruiterApplicationStatusThunk.fulfilled,
        (state, action) => {
          state.isUpdatingApplicationStatus = false;
          state.updatingApplicationId = null;

          const application = action.payload.data?.application || null;
          state.updatedApplication = application;

          if (application && state.jobApplicationsData?.applications) {
            state.jobApplicationsData.applications =
              state.jobApplicationsData.applications.map((item) =>
                item._id === application._id ? application : item
              );
          }
        }
      )
      .addCase(
        updateRecruiterApplicationStatusThunk.rejected,
        (state, action) => {
          state.isUpdatingApplicationStatus = false;
          state.updatingApplicationId = null;
          state.updateApplicationStatusError =
            action.payload || "Unable to update application status.";
        }
      )
            // Fetch recruiter application details
      .addCase(
        fetchRecruiterApplicationDetailsThunk.pending,
        (state) => {
          state.isApplicationDetailsLoading = true;
          state.applicationDetailsError = null;
          state.applicationDetails = null;
        }
      )
      .addCase(
        fetchRecruiterApplicationDetailsThunk.fulfilled,
        (state, action) => {
          state.isApplicationDetailsLoading = false;
          state.applicationDetails = action.payload.data || null;
        }
      )
      .addCase(
        fetchRecruiterApplicationDetailsThunk.rejected,
        (state, action) => {
          state.isApplicationDetailsLoading = false;
          state.applicationDetailsError =
            action.payload || "Unable to fetch application details.";
        }
      );
  },
});

export const {
  clearRecruiterDashboardError,
  clearRecruiterJobsError,
  clearCreateJobError,
  clearCreatedJob,
  clearUpdateJobError,
  clearUpdatedJob,
  clearArchiveJobError,
  clearArchivedJob,
  clearRestoreJobError,
  clearRestoredJob,
  clearDeleteJobError,
  clearDeletedJob,
  clearJobApplicationsError,
  clearUpdateApplicationStatusError,
  clearUpdatedApplication,
    clearApplicationDetails,
  clearApplicationDetailsError,
} = recruiterSlice.actions;

export default recruiterSlice.reducer;
