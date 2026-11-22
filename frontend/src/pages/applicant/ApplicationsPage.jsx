
import { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchMyApplicationsThunk,
  withdrawApplicationThunk,
} from "../../features/applications/applicationsThunks";

import {
  clearWithdrawFeedback,
} from "../../features/applications/applicationsSlice";

const getApplicationStatus = (status) => {
  const statuses = {
    PENDING: {
      label: "Under Review",
      className: "bg-warning-subtle text-warning-emphasis",
      icon: "bi-clock-history",
    },
    SHORTLISTED: {
      label: "Shortlisted",
      className: "bg-success-subtle text-success",
      icon: "bi-check-circle",
    },
    REJECTED: {
      label: "Not Selected",
      className: "bg-danger-subtle text-danger",
      icon: "bi-x-circle",
    },
    WITHDRAWN: {
      label: "Withdrawn",
      className: "bg-secondary-subtle text-secondary",
      icon: "bi-arrow-counterclockwise",
    },
  };

  return statuses[status] || {
    label: status || "Unknown",
    className: "bg-secondary-subtle text-secondary",
    icon: "bi-question-circle",
  };
};

const formatDate = (date) => {
  if (!date) return "Date unavailable";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const formatSalary = (salary) => {
  if (!salary?.min && !salary?.max) return "Salary not disclosed";

  const currency = salary.currency || "INR";

  const formatAmount = (amount) =>
    new Intl.NumberFormat("en-IN", {
      maximumFractionDigits: 0,
    }).format(amount);

  if (salary.min && salary.max) {
    return `${currency} ${formatAmount(salary.min)} - ${formatAmount(salary.max)}`;
  }

  return `${currency} ${formatAmount(salary.min || salary.max)}`;
};

const ApplicationsPage = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  const {
    applications,
    pagination,
    isLoading,
    isWithdrawing,
    error,
    withdrawError,
    withdrawSuccess,
  } = useSelector((state) => state.applications);

  const currentPage = Math.max(
    1,
    Number(searchParams.get("page")) || 1
  );

  useEffect(() => {
    dispatch(fetchMyApplicationsThunk({
      page: currentPage,
      limit: 10,
    }));
  }, [dispatch, currentPage]);

  const handleWithdraw = async (applicationId) => {
    const confirmed = window.confirm(
      "Are you sure you want to withdraw this application? This action cannot be undone."
    );

    if (!confirmed) return;

    dispatch(clearWithdrawFeedback());

    try {
      await dispatch(
        withdrawApplicationThunk(applicationId)
      ).unwrap();
    } catch {
      // The Redux slice stores the withdrawal error.
    }
  };

  const changePage = (page) => {
    setSearchParams({ page: String(page) });
  };

  return (
    <div className="container py-4 py-lg-5">
      {/* Page heading */}
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <span className="text-primary fw-semibold small">
            APPLICANT WORKSPACE
          </span>

          <h2 className="fw-bold mt-2 mb-1">
            My Applications
          </h2>

          <p className="text-secondary mb-0">
            Track your applications and stay updated on your job search.
          </p>
        </div>

        <Link to="/jobs" className="btn btn-primary">
          <i className="bi bi-search me-2" />
          Explore Jobs
        </Link>
      </div>

      {/* Feedback */}
      {withdrawSuccess && (
        <div className="alert alert-success alert-dismissible fade show">
          <i className="bi bi-check-circle me-2" />
          {withdrawSuccess}

          <button
            type="button"
            className="btn-close"
            onClick={() => dispatch(clearWithdrawFeedback())}
          />
        </div>
      )}

      {withdrawError && (
        <div className="alert alert-danger alert-dismissible fade show">
          <i className="bi bi-exclamation-circle me-2" />
          {withdrawError}

          <button
            type="button"
            className="btn-close"
            onClick={() => dispatch(clearWithdrawFeedback())}
          />
        </div>
      )}

      {/* Application count */}
      <div className="card border-0 shadow-sm rounded-4 mb-4">
        <div className="card-body p-4">
          <div className="d-flex align-items-center gap-3">
            <div
              className="rounded-3 bg-primary-subtle text-primary d-flex align-items-center justify-content-center"
              style={{ width: 48, height: 48 }}
            >
              <i className="bi bi-briefcase fs-4" />
            </div>

            <div>
              <div className="text-secondary small">
                Total applications
              </div>

              <div className="fs-4 fw-bold">
                {pagination?.totalApplications ?? applications.length}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="card border-0 shadow-sm rounded-4">
          <div className="card-body text-center py-5">
            <div className="spinner-border text-primary mb-3" />
            <p className="text-secondary mb-0">
              Loading your applications...
            </p>
          </div>
        </div>
      )}

      {/* Error */}
      {!isLoading && error && (
        <div className="card border-0 shadow-sm rounded-4">
          <div className="card-body text-center py-5">
            <i className="bi bi-exclamation-triangle fs-1 text-danger" />

            <h5 className="fw-semibold mt-3">
              Unable to load applications
            </h5>

            <p className="text-secondary">{error}</p>

            <button
              type="button"
              className="btn btn-outline-primary"
              onClick={() =>
                dispatch(fetchMyApplicationsThunk({
                  page: currentPage,
                  limit: 10,
                }))
              }
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !error && applications.length === 0 && (
        <div className="card border-0 shadow-sm rounded-4">
          <div className="card-body text-center py-5 px-3">
            <div className="mb-3">
              <i className="bi bi-folder2-open display-3 text-secondary" />
            </div>

            <h5 className="fw-bold">
              No applications yet
            </h5>

            <p className="text-secondary mx-auto mb-4" style={{ maxWidth: 420 }}>
              Your submitted job applications will appear here.
              Start exploring opportunities that match your skills.
            </p>

            <Link to="/jobs" className="btn btn-primary">
              Explore Opportunities
            </Link>
          </div>
        </div>
      )}

      {/* Application list */}
      {!isLoading && !error && applications.length > 0 && (
        <>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="fw-bold mb-0">
              Your submitted applications
            </h5>

            <span className="text-secondary small">
              Page {pagination?.currentPage || currentPage}
              {" "}of {pagination?.totalPages || 1}
            </span>
          </div>

          <div className="d-flex flex-column gap-3">
            {applications.map((application) => {
              const job = application.job;
              const status = getApplicationStatus(application.status);

              return (
                <div
                  key={application._id}
                  className="card border-0 shadow-sm rounded-4"
                >
                  <div className="card-body p-3 p-md-4">
                    <div className="d-flex flex-column flex-lg-row justify-content-between gap-3">
                      <div className="flex-grow-1">
                        <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
                          <span
                            className={`badge rounded-pill px-3 py-2 ${status.className}`}
                          >
                            <i className={`bi ${status.icon} me-1`} />
                            {status.label}
                          </span>

                          <span className="text-secondary small">
                            Applied {formatDate(
                              application.appliedAt || application.createdAt
                            )}
                          </span>
                        </div>

                        <h5 className="fw-bold mb-2">
                          {job?.status === "ARCHIVED" ? (
                            <span>{job?.title || "Job no longer available"}</span>
                          ) : job?._id ? (
                            <Link
                              to={`/jobs/${job._id}`}
                              className="text-decoration-none text-dark"
                            >
                              {job.title}
                            </Link>
                          ) : (
                            <span>{job?.title || "Job no longer available"}</span>
                          )}
                        </h5>

                        <div className="d-flex flex-wrap gap-3 text-secondary small mb-3">
                          <span>
                            <i className="bi bi-geo-alt me-1" />
                            {job?.location || "Location not specified"}
                          </span>

                          <span>
                            <i className="bi bi-briefcase me-1" />
                            {job?.employmentType?.replaceAll("_", " ") || "Not specified"}
                          </span>

                          <span>
                            <i className="bi bi-laptop me-1" />
                            {job?.workMode || "Not specified"}
                          </span>
                        </div>

                        <div className="small text-secondary">
                          <i className="bi bi-cash-stack me-1" />
                          {formatSalary(job?.salary)}
                        </div>
                      </div>

                      <div className="d-flex flex-row flex-lg-column gap-2 align-items-stretch justify-content-lg-center">
                        <Link
                          to={`/applicant/applications/${application._id}`}
                          className="btn btn-outline-primary btn-sm"
                        >
                          View Details
                          <i className="bi bi-arrow-right ms-2" />
                        </Link>

                        {["PENDING", "SHORTLISTED"].includes(
                          application.status
                        ) && (
                          <button
                            type="button"
                            className="btn btn-outline-danger btn-sm"
                            disabled={isWithdrawing}
                            onClick={() => handleWithdraw(application._id)}
                          >
                            {isWithdrawing ? (
                              <>
                                <span className="spinner-border spinner-border-sm me-1" />
                                Withdrawing
                              </>
                            ) : (
                              <>
                                <i className="bi bi-x-circle me-1" />
                                Withdraw
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {pagination?.totalPages > 1 && (
            <nav className="mt-4" aria-label="Applications pagination">
              <ul className="pagination justify-content-center flex-wrap">
                <li className={`page-item ${!pagination.hasPreviousPage ? "disabled" : ""}`}>
                  <button
                    type="button"
                    className="page-link"
                    disabled={!pagination.hasPreviousPage}
                    onClick={() => changePage(currentPage - 1)}
                  >
                    Previous
                  </button>
                </li>

                {Array.from(
                  { length: pagination.totalPages },
                  (_, index) => index + 1
                ).map((page) => (
                  <li
                    key={page}
                    className={`page-item ${page === currentPage ? "active" : ""}`}
                  >
                    <button
                      type="button"
                      className="page-link"
                      onClick={() => changePage(page)}
                    >
                      {page}
                    </button>
                  </li>
                ))}

                <li className={`page-item ${!pagination.hasNextPage ? "disabled" : ""}`}>
                  <button
                    type="button"
                    className="page-link"
                    disabled={!pagination.hasNextPage}
                    onClick={() => changePage(currentPage + 1)}
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </>
      )}
    </div>
  );
};

export default ApplicationsPage;
