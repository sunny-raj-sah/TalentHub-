
import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchApplicationByIdThunk,
  withdrawApplicationThunk,
} from "../../features/applications/applicationsThunks";

import {
  clearApplicationDetails,
  clearWithdrawFeedback,
} from "../../features/applications/applicationsSlice";

import ApplicationStatusCard from "../../components/applications/ApplicationStatusCard";
import ApplicationJobCard from "../../components/applications/ApplicationJobCard";
import ApplicationResumeCard from "../../components/applications/ApplicationResumeCard";
import ApplicationCoverLetter from "../../components/applications/ApplicationCoverLetter";
import ApplicationActions from "../../components/applications/ApplicationActions";

function ApplicationDetailsPage() {
  const { applicationId } = useParams();
  const dispatch = useDispatch();

  const {
    selectedApplication,
    isDetailsLoading,
    detailsError,
    isWithdrawing,
    withdrawError,
  } = useSelector((state) => state.applications);

  // Fetch application details whenever the route ID changes.
  useEffect(() => {
    if (applicationId) {
      dispatch(fetchApplicationByIdThunk(applicationId));
    }

    return () => {
      dispatch(clearApplicationDetails());
      dispatch(clearWithdrawFeedback());
    };
  }, [dispatch, applicationId]);

  // Retry fetching application details.
  const handleRetry = () => {
    dispatch(fetchApplicationByIdThunk(applicationId));
  };

  // Withdraw application.
  const handleWithdraw = async () => {
    if (!selectedApplication?._id) return;

    try {
      await dispatch(
        withdrawApplicationThunk(selectedApplication._id)
      ).unwrap();
    } catch (error) {
      // The Redux slice stores the withdrawal error.
      console.error("Application withdrawal failed:", error);
    }
  };

  // Loading state.
  if (isDetailsLoading) {
    return (
      <div className="container py-5">
        <div className="d-flex flex-column align-items-center justify-content-center text-center py-5">
          <div
            className="spinner-border text-primary mb-3"
            role="status"
            aria-label="Loading application"
          />

          <h5 className="fw-semibold mb-1">
            Loading application details
          </h5>

          <p className="text-muted small mb-0">
            Please wait while we retrieve your application.
          </p>
        </div>
      </div>
    );
  }

  // Error state.
  if (detailsError) {
    return (
      <div className="container py-5">
        <div className="card border-0 shadow-sm rounded-4 mx-auto" style={{ maxWidth: 560 }}>
          <div className="card-body p-4 p-md-5 text-center">
            <div className="text-danger mb-3">
              <i className="bi bi-exclamation-circle fs-1" />
            </div>

            <h4 className="fw-bold mb-2">
              Unable to load application
            </h4>

            <p className="text-muted mb-4">
              {detailsError}
            </p>

            <div className="d-flex flex-column flex-sm-row justify-content-center gap-2">
              <button
                type="button"
                className="btn btn-primary rounded-pill px-4"
                onClick={handleRetry}
              >
                <i className="bi bi-arrow-clockwise me-2" />
                Try Again
              </button>

              <Link
                to="/applicant/applications"
                className="btn btn-outline-secondary rounded-pill px-4"
              >
                My Applications
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // No application found.
  if (!selectedApplication) {
    return (
      <div className="container py-5">
        <div className="text-center py-5">
          <i className="bi bi-file-earmark-x text-muted fs-1" />

          <h4 className="fw-bold mt-3">
            Application not found
          </h4>

          <p className="text-muted">
            This application may no longer be available.
          </p>

          <Link
            to="/applicant/applications"
            className="btn btn-primary rounded-pill px-4"
          >
            <i className="bi bi-arrow-left me-2" />
            Back to My Applications
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-light min-vh-100 py-4 py-md-5">
      <div className="container">
        {/* Page heading */}
        <div className="mb-4">
          <Link
            to="/applicant/applications"
            className="text-decoration-none text-muted small"
          >
            <i className="bi bi-arrow-left me-2" />
            Back to My Applications
          </Link>

          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end gap-3 mt-3">
            <div>
              <span className="badge text-bg-primary-subtle text-primary rounded-pill mb-2">
                Applicant Dashboard
              </span>

              <h2 className="fw-bold mb-1">
                Application Details
              </h2>

              <p className="text-muted mb-0">
                Track your application and review the information you submitted.
              </p>
            </div>

            <span className="text-muted small">
              Application ID: {selectedApplication._id}
            </span>
          </div>
        </div>

        {/* Withdrawal error */}
        {withdrawError && (
          <div
            className="alert alert-danger alert-dismissible fade show rounded-3"
            role="alert"
          >
            <i className="bi bi-exclamation-triangle me-2" />
            {withdrawError}

            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={() => dispatch(clearWithdrawFeedback())}
            />
          </div>
        )}

        {/* Application content */}
        <div className="row g-4">
          <div className="col-lg-8">
            <div className="d-flex flex-column gap-4">
              <ApplicationStatusCard
                application={selectedApplication}
              />

              <ApplicationJobCard
                job={selectedApplication.job}
                recruiter={selectedApplication.recruiter}
              />

              <ApplicationCoverLetter
                coverLetter={selectedApplication.coverLetter}
              />
            </div>
          </div>

          <div className="col-lg-4">
            <div className="d-flex flex-column gap-4">
              <ApplicationResumeCard
                application={selectedApplication}
              />

              <div className="card border-0 shadow-sm rounded-4">
                <div className="card-body p-4">
                  <h6 className="fw-bold mb-2">
                    Application Support
                  </h6>

                  <p className="text-muted small mb-0">
                    Keep track of your application status here. Any status
                    changes made by the recruiter will be reflected when
                    you refresh this page.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="col-12">
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-body p-3 p-md-4">
                <ApplicationActions
                  application={selectedApplication}
                  onWithdraw={handleWithdraw}
                  isWithdrawing={isWithdrawing}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ApplicationDetailsPage;
