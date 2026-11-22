
import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchMyApplicationsThunk,
} from "../../features/applications/applicationsThunks";

import ApplicantDashboardStatCard from "../../components/applicant/ApplicantDashboardStatCard";
import ApplicantDashboardApplicationItem from "../../components/applicant/ApplicantDashboardApplicationItem";

function ApplicantDashboardPage() {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);

  const {
    applications,
    isLoading,
    error,
  } = useSelector((state) => state.applications);

  useEffect(() => {
    dispatch(fetchMyApplicationsThunk());
  }, [dispatch]);

  const statistics = useMemo(() => {
    const total = applications.length;

    const pending = applications.filter((application) =>
      ["PENDING", "REVIEWING", "UNDER_REVIEW"].includes(
        application.status?.toUpperCase()
      )
    ).length;

    const shortlisted = applications.filter((application) =>
      application.status?.toUpperCase() === "SHORTLISTED"
    ).length;

    const rejected = applications.filter((application) =>
      application.status?.toUpperCase() === "REJECTED"
    ).length;

    return {
      total,
      pending,
      shortlisted,
      rejected,
    };
  }, [applications]);

  const recentApplications = useMemo(() => {
    return [...applications]
      .sort(
        (a, b) =>
          new Date(b.createdAt || b.appliedAt || 0) -
          new Date(a.createdAt || a.appliedAt || 0)
      )
      .slice(0, 5);
  }, [applications]);

  const firstName = user?.name?.trim().split(" ")[0] || "there";

  return (
    <main className="container py-4 py-lg-5">
      {/* Welcome section */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <p className="text-primary fw-semibold small mb-2">
            APPLICANT DASHBOARD
          </p>

          <h2 className="fw-bold mb-2">
            Welcome back, {firstName}!
          </h2>

          <p className="text-secondary mb-0">
            Track your applications and keep moving towards your next opportunity.
          </p>
        </div>

        <Link to="/jobs" className="btn btn-primary">
          <i className="bi bi-search me-2" />
          Explore Jobs
        </Link>
      </div>

      {/* Statistics */}
      {isLoading && applications.length === 0 ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>

          <p className="text-secondary mt-3 mb-0">
            Loading your dashboard...
          </p>
        </div>
      ) : error ? (
        <div className="alert alert-danger d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
          <span>{error}</span>

          <button
            type="button"
            className="btn btn-outline-danger btn-sm"
            onClick={() => dispatch(fetchMyApplicationsThunk())}
          >
            Try Again
          </button>
        </div>
      ) : (
        <>
          <div className="row g-3 mb-5">
            <div className="col-12 col-sm-6 col-xl-3">
              <ApplicantDashboardStatCard
                title="Total Applications"
                value={statistics.total}
                description="Jobs you've applied for"
                icon="bi-file-earmark-text"
                iconClass="text-primary"
              />
            </div>

            <div className="col-12 col-sm-6 col-xl-3">
              <ApplicantDashboardStatCard
                title="Pending"
                value={statistics.pending}
                description="Applications awaiting a decision"
                icon="bi-hourglass-split"
                iconClass="text-warning"
              />
            </div>

            <div className="col-12 col-sm-6 col-xl-3">
              <ApplicantDashboardStatCard
                title="Shortlisted"
                value={statistics.shortlisted}
                description="Applications progressing"
                icon="bi-check-circle"
                iconClass="text-success"
              />
            </div>

            <div className="col-12 col-sm-6 col-xl-3">
              <ApplicantDashboardStatCard
                title="Rejected"
                value={statistics.rejected}
                description="Applications not selected"
                icon="bi-x-circle"
                iconClass="text-danger"
              />
            </div>
          </div>

          {/* Recent applications */}
          <section className="card border-0 shadow-sm mb-4">
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-center gap-3 mb-2">
                <div>
                  <h5 className="fw-bold mb-1">
                    Recent Applications
                  </h5>

                  <p className="text-secondary small mb-0">
                    Keep track of your latest applications.
                  </p>
                </div>

                <Link
                  to="/applicant/applications"
                  className="btn btn-sm btn-outline-primary"
                >
                  View All
                </Link>
              </div>

              {recentApplications.length > 0 ? (
                <div>
                  {recentApplications.map((application) => (
                    <ApplicantDashboardApplicationItem
                      key={application._id}
                      application={application}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-5">
                  <i className="bi bi-file-earmark-plus fs-1 text-secondary" />

                  <h6 className="fw-bold mt-3">
                    No applications yet
                  </h6>

                  <p className="text-secondary small mb-3">
                    Explore available jobs and submit your first application.
                  </p>

                  <Link to="/jobs" className="btn btn-primary btn-sm">
                    Browse Jobs
                  </Link>
                </div>
              )}
            </div>
          </section>

          {/* Quick links */}
          <section>
            <h5 className="fw-bold mb-3">Quick Access</h5>

            <div className="row g-3">
              <div className="col-12 col-md-4">
                <Link
                  to="/applicant/bookmarks"
                  className="card border-0 shadow-sm text-decoration-none h-100"
                >
                  <div className="card-body p-4">
                    <i className="bi bi-bookmark-heart fs-3 text-primary" />
                    <h6 className="fw-bold text-dark mt-3 mb-1">
                      Saved Jobs
                    </h6>
                    <p className="text-secondary small mb-0">
                      Revisit jobs you've bookmarked.
                    </p>
                  </div>
                </Link>
              </div>

              <div className="col-12 col-md-4">
                <Link
                  to="/applicant/profile"
                  className="card border-0 shadow-sm text-decoration-none h-100"
                >
                  <div className="card-body p-4">
                    <i className="bi bi-person-circle fs-3 text-primary" />
                    <h6 className="fw-bold text-dark mt-3 mb-1">
                      My Profile
                    </h6>
                    <p className="text-secondary small mb-0">
                      Keep your professional profile updated.
                    </p>
                  </div>
                </Link>
              </div>

              <div className="col-12 col-md-4">
                <Link
                  to="/applicant/interview-preparation"
                  className="card border-0 shadow-sm text-decoration-none h-100"
                >
                  <div className="card-body p-4">
                    <i className="bi bi-robot fs-3 text-primary" />
                    <h6 className="fw-bold text-dark mt-3 mb-1">
                      AI Interview Prep
                    </h6>
                    <p className="text-secondary small mb-0">
                      Prepare for your next interview with AI.
                    </p>
                  </div>
                </Link>
              </div>
            </div>
          </section>
        </>
      )}
    </main>
  );
}

export default ApplicantDashboardPage;
