
import {useCallback, useEffect, useState  } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchRecruiterJobApplicationsThunk,
  updateRecruiterApplicationStatusThunk,
  fetchRecruiterApplicationDetailsThunk,
} from "../../features/recruiter/recruiterThunks";

import {
  clearJobApplicationsError,
  clearUpdateApplicationStatusError,
  clearApplicationDetails,
} from "../../features/recruiter/recruiterSlice";

import RecruiterApplicationCard from "../../components/recruiter/applications/RecruiterApplicationCard";
import RecruiterApplicationDetailsModal from "../../components/recruiter/applications/RecruiterApplicationDetailsModal";
import RecruiterApplicationsFilters from "../../components/recruiter/applications/RecruiterApplicationsFilters";
import RecruiterApplicationsPagination from "../../components/recruiter/applications/RecruiterApplicationsPagination";

function RecruiterJobApplicationsPage() {
  const { jobId } = useParams();
  const dispatch = useDispatch();

  const [status, setStatus] = useState("ALL");
  const [sort, setSort] = useState("NEWEST");
  const [page, setPage] = useState(1);
  const [selectedApplicationId, setSelectedApplicationId] = useState(null);

  const {
    jobApplicationsData,
    isJobApplicationsLoading,
    jobApplicationsError,
    isUpdatingApplicationStatus,
    updatingApplicationId,
    updateApplicationStatusError,

    applicationDetails,
    isApplicationDetailsLoading,
    applicationDetailsError,
  } = useSelector((state) => state.recruiter);

//   const fetchApplications = () => {
//     dispatch(
//       fetchRecruiterJobApplicationsThunk({
//         jobId,
//         ...(status !== "ALL" && { status }),
//         sort,
//         page,
//         limit: 10,
//       })
//     );
//   };

//   useEffect(() => {
//     fetchApplications();
//   }, [jobId, status, sort, page]);
const fetchApplications = useCallback(() => {
  dispatch(
    fetchRecruiterJobApplicationsThunk({
      jobId,
      ...(status !== "ALL" && { status }),
      sort,
      page,
      limit: 10,
    })
  );
}, [dispatch, jobId, status, sort, page]);

useEffect(() => {
  fetchApplications();
}, [fetchApplications]);

const handleStatusChange = (value) => {
  setStatus(value);
  setPage(1);
  dispatch(clearUpdateApplicationStatusError());
};

 
   

  const handleSortChange = (value) => {
    setSort(value);
    setPage(1);
  };

  const handleUpdateStatus = async (applicationId, newStatus) => {
    try {
      await dispatch(
        updateRecruiterApplicationStatusThunk({
          applicationId,
          status: newStatus,
        })
      ).unwrap();

      fetchApplications();
    } catch {
      // The rejected thunk stores the error in recruiterSlice.
    }
  };

  const handleViewDetails = (applicationId) => {
    setSelectedApplicationId(applicationId);

    dispatch(
      fetchRecruiterApplicationDetailsThunk({
        jobId,
        applicationId,
      })
    );
  };

  const handleCloseDetails = () => {
    setSelectedApplicationId(null);
    dispatch(clearApplicationDetails());
  };

  const handleRetryDetails = () => {
    if (!selectedApplicationId) return;

    dispatch(
      fetchRecruiterApplicationDetailsThunk({
        jobId,
        applicationId: selectedApplicationId,
      })
    );
  };

  const job = jobApplicationsData?.job;
  const applications = jobApplicationsData?.applications || [];
  const pagination = jobApplicationsData?.pagination;

  return (
    <div className="container py-4">
      <div className="mb-4">
        <Link
          to="/recruiter/jobs"
          className="text-decoration-none text-muted"
        >
          <i className="bi bi-arrow-left me-2" />
          Back to My Jobs
        </Link>
      </div>

      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h2 className="fw-bold mb-1">Manage Applicants</h2>
          <p className="text-muted mb-0">
            {job?.title || "Review and manage applications for this job."}
          </p>
        </div>

        <button
          type="button"
          className="btn btn-outline-primary"
          onClick={fetchApplications}
          disabled={isJobApplicationsLoading}
        >
          <i className="bi bi-arrow-clockwise me-2" />
          Refresh
        </button>
      </div>

      {jobApplicationsError && (
        <div className="alert alert-danger" role="alert">
          <div className="d-flex justify-content-between align-items-center gap-2">
            <span>{jobApplicationsError}</span>

            <button
              type="button"
              className="btn btn-sm btn-outline-danger"
              onClick={() => {
                dispatch(clearJobApplicationsError());
                fetchApplications();
              }}
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {updateApplicationStatusError && (
        <div className="alert alert-danger alert-dismissible" role="alert">
          {updateApplicationStatusError}

          <button
            type="button"
            className="btn-close"
            aria-label="Close"
            onClick={() =>
              dispatch(clearUpdateApplicationStatusError())
            }
          />
        </div>
      )}

      <RecruiterApplicationsFilters
        status={status}
        sort={sort}
        onStatusChange={handleStatusChange}
        onSortChange={handleSortChange}
      />

      {isJobApplicationsLoading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">
              Loading applications...
            </span>
          </div>

          <p className="text-muted mt-3 mb-0">
            Loading applications...
          </p>
        </div>
      ) : (
        <>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="mb-0">Applications</h5>

            <span className="text-muted small">
              {pagination?.totalApplications ?? applications.length} found
            </span>
          </div>

          {applications.length > 0 ? (
            <>
              {applications.map((application) => (
                <RecruiterApplicationCard
                  key={application._id}
                  application={application}
                  onUpdateStatus={handleUpdateStatus}
                  onViewDetails={handleViewDetails}
                  isUpdating={
                    isUpdatingApplicationStatus &&
                    updatingApplicationId === application._id
                  }
                />
              ))}

              <RecruiterApplicationsPagination
                pagination={pagination}
                onPageChange={setPage}
              />
            </>
          ) : (
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center py-5">
                <i className="bi bi-people fs-1 text-muted" />

                <h5 className="mt-3">No applications found</h5>

                <p className="text-muted mb-0">
                  There are no applications matching the selected filter.
                </p>
              </div>
            </div>
          )}
        </>
      )}

      {selectedApplicationId && (
        <RecruiterApplicationDetailsModal
          details={applicationDetails}
          isLoading={isApplicationDetailsLoading}
          error={applicationDetailsError}
          onClose={handleCloseDetails}
          onRetry={handleRetryDetails}
        />
      )}
    </div>
  );
}

export default RecruiterJobApplicationsPage;
