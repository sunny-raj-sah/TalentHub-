
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchRecruiterJobsThunk,
  archiveRecruiterJobThunk,
  restoreRecruiterJobThunk,
  deleteRecruiterJobThunk,
} from "../../features/recruiter/recruiterThunks";

import {
  clearArchiveJobError,
  clearArchivedJob,
  clearRestoreJobError,
  clearRestoredJob,
  clearDeleteJobError,
  clearDeletedJob,
} from "../../features/recruiter/recruiterSlice";

import RecruiterJobCard from "../../components/recruiter/RecruiterJobCard";
import RecruiterJobsPagination from "../../components/recruiter/RecruiterJobsPagination";
import RecruiterJobsStatusFilter from "../../components/recruiter/RecruiterJobsStatusFilter";
import RecruiterJobActionModal from "../../components/recruiter/RecruiterJobActionModal";

const JOBS_PER_PAGE = 10;

function RecruiterJobsPage() {
  const dispatch = useDispatch();

  const {
    jobsData,
    isJobsLoading,
    jobsError,

    isArchivingJob,
    archiveJobError,

    isRestoringJob,
    restoreJobError,

    isDeletingJob,
    deleteJobError,
  } = useSelector((state) => state.recruiter);

  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);

  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedAction, setSelectedAction] = useState(null);

  const jobs = jobsData?.jobs || [];
  const pagination = jobsData?.pagination;

  const isActionLoading =
    isArchivingJob || isRestoringJob || isDeletingJob;

  const actionErrors = {
    archive: archiveJobError,
    restore: restoreJobError,
    delete: deleteJobError,
  };

  const actionError = selectedAction
    ? actionErrors[selectedAction]
    : null;

  // Fetch jobs whenever the selected filter or page changes.
  useEffect(() => {
    dispatch(
      fetchRecruiterJobsThunk({
        ...(status && { status }),
        page,
        limit: JOBS_PER_PAGE,
      })
    );
  }, [dispatch, status, page]);

  const refreshJobs = () => {
    dispatch(
      fetchRecruiterJobsThunk({
        ...(status && { status }),
        page,
        limit: JOBS_PER_PAGE,
      })
    );
  };

  const clearActionState = () => {
    dispatch(clearArchiveJobError());
    dispatch(clearArchivedJob());

    dispatch(clearRestoreJobError());
    dispatch(clearRestoredJob());

    dispatch(clearDeleteJobError());
    dispatch(clearDeletedJob());
  };

  const handleStatusChange = (nextStatus) => {
    setStatus(nextStatus);
    setPage(1);
  };

  const handlePageChange = (nextPage) => {
    if (nextPage < 1 || nextPage > (pagination?.totalPages || 1)) {
      return;
    }

    setPage(nextPage);
  };

  const handleRetry = () => {
    refreshJobs();
  };

  // Open the shared confirmation modal.
  const handleActionClick = (job, action) => {
    clearActionState();

    setSelectedJob(job);
    setSelectedAction(action);
  };

  const handleCloseModal = () => {
    if (isActionLoading) return;

    setSelectedJob(null);
    setSelectedAction(null);

    clearActionState();
  };

  // Execute the selected job action.
  const handleConfirmAction = async () => {
    if (!selectedJob?._id || !selectedAction || isActionLoading) {
      return;
    }

    try {
      switch (selectedAction) {
        case "archive":
          await dispatch(
            archiveRecruiterJobThunk(selectedJob._id)
          ).unwrap();
          break;

        case "restore":
          await dispatch(
            restoreRecruiterJobThunk(selectedJob._id)
          ).unwrap();
          break;

        case "delete":
          await dispatch(
            deleteRecruiterJobThunk(selectedJob._id)
          ).unwrap();
          break;

        default:
          return;
      }

      setSelectedJob(null);
      setSelectedAction(null);

      clearActionState();

      // If the last job on this page was removed,
      // move to the previous page when possible.
      if (jobs.length === 1 && page > 1) {
        setPage((currentPage) => currentPage - 1);
      } else {
        refreshJobs();
      }
    } catch {
      // The rejected thunk stores its error in Redux state.
      // Keep the modal open so the user can read the error.
    }
  };

  return (
    <div className="container-fluid py-4 px-3 px-lg-4">
      {/* Page heading */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h2 className="fw-bold mb-1">My Jobs</h2>

          <p className="text-muted mb-0">
            Manage your job postings and track applications.
          </p>
        </div>

        <Link to="/recruiter/jobs/new" className="btn btn-primary">
          <i className="bi bi-plus-lg me-2" />
          Post a Job
        </Link>
      </div>

      {/* Status filters */}
      <RecruiterJobsStatusFilter
        status={status}
        onStatusChange={handleStatusChange}
        disabled={isJobsLoading}
      />

      {/* Loading state */}
      {isJobsLoading && (
        <div className="card border-0 shadow-sm">
          <div className="card-body text-center py-5">
            <div className="spinner-border text-primary mb-3" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>

            <p className="text-muted mb-0">
              Loading your job postings...
            </p>
          </div>
        </div>
      )}

      {/* Error state */}
      {!isJobsLoading && jobsError && (
        <div className="card border-0 shadow-sm">
          <div className="card-body text-center py-5">
            <i className="bi bi-exclamation-circle text-danger fs-1 mb-3" />

            <h5 className="fw-semibold">Unable to load jobs</h5>

            <p className="text-muted">{jobsError}</p>

            <button
              type="button"
              className="btn btn-primary"
              onClick={handleRetry}
            >
              <i className="bi bi-arrow-clockwise me-2" />
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Jobs list */}
      {!isJobsLoading && !jobsError && (
        <>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="fw-semibold mb-0">
              {status
                ? `${status === "ACTIVE" ? "Active" : "Archived"} Jobs`
                : "All Job Postings"}
            </h5>

            <span className="text-muted small">
              {pagination?.totalJobs || 0} jobs found
            </span>
          </div>

          {jobs.length > 0 ? (
            <>
              {jobs.map((job) => (
                <RecruiterJobCard
                  key={job._id}
                  job={job}
                  onArchive={(selected) =>
                    handleActionClick(selected, "archive")
                  }
                  onRestore={(selected) =>
                    handleActionClick(selected, "restore")
                  }
                  onDelete={(selected) =>
                    handleActionClick(selected, "delete")
                  }
                  isArchiving={
                    isArchivingJob && selectedJob?._id === job._id
                  }
                  isRestoring={
                    isRestoringJob && selectedJob?._id === job._id
                  }
                  isDeleting={
                    isDeletingJob && selectedJob?._id === job._id
                  }
                />
              ))}

              <RecruiterJobsPagination
                pagination={pagination}
                onPageChange={handlePageChange}
              />
            </>
          ) : (
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center py-5">
                <i className="bi bi-briefcase text-muted fs-1 mb-3" />

                <h5 className="fw-semibold">
                  {status === "ACTIVE"
                    ? "No active jobs"
                    : status === "ARCHIVED"
                      ? "No archived jobs"
                      : "You haven't posted any jobs yet"}
                </h5>

                <p className="text-muted mb-3">
                  {status
                    ? "There are no job postings in this category."
                    : "Create your first job posting to start finding candidates."}
                </p>

                {!status && (
                  <Link
                    to="/recruiter/jobs/new"
                    className="btn btn-primary"
                  >
                    <i className="bi bi-plus-lg me-2" />
                    Create Your First Job
                  </Link>
                )}
              </div>
            </div>
          )}
        </>
      )}

      {/* Shared Archive / Restore / Delete modal */}
      <RecruiterJobActionModal
        job={selectedJob}
        actionType={selectedAction}
        isLoading={isActionLoading}
        error={actionError}
        onClose={handleCloseModal}
        onConfirm={handleConfirmAction}
      />
    </div>
  );
}

export default RecruiterJobsPage;
