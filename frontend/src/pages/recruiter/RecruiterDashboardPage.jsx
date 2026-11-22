
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchRecruiterDashboardThunk,
} from "../../features/recruiter/recruiterThunks";

import RecruiterDashboardStatCard from "../../components/recruiter/RecruiterDashboardStatCard";
import RecruiterDashboardApplicationItem from "../../components/recruiter/RecruiterDashboardApplicationItem";
import RecruiterDashboardQuickLink from "../../components/recruiter/RecruiterDashboardQuickLink";

function RecruiterDashboardPage() {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);

  const {
    dashboard,
    isDashboardLoading,
    dashboardError,
  } = useSelector((state) => state.recruiter);

  useEffect(() => {
    dispatch(fetchRecruiterDashboardThunk());
  }, [dispatch]);

  const firstName = user?.name?.trim().split(" ")[0] || "there";

  const overview = dashboard?.overview || {};
  const recentApplications = dashboard?.recentApplications || [];

  const statistics = [
    {
      title: "Total Jobs",
      value: overview.totalJobs,
      description: "Jobs you've created",
      icon: "bi-briefcase",
      iconClass: "text-primary",
    },
    {
      title: "Active Jobs",
      value: overview.activeJobs,
      description: "Currently accepting applications",
      icon: "bi-check-circle",
      iconClass: "text-success",
    },
    {
      title: "Archived Jobs",
      value: overview.archivedJobs,
      description: "Jobs no longer active",
      icon: "bi-archive",
      iconClass: "text-secondary",
    },
    {
      title: "Total Applications",
      value: overview.totalApplications,
      description: "Applications received",
      icon: "bi-file-earmark-text",
      iconClass: "text-primary",
    },
    {
      title: "Pending",
      value: overview.pendingApplications,
      description: "Awaiting your review",
      icon: "bi-hourglass-split",
      iconClass: "text-warning",
    },
    {
      title: "Shortlisted",
      value: overview.shortlistedApplications,
      description: "Candidates shortlisted",
      icon: "bi-person-check",
      iconClass: "text-success",
    },
    {
      title: "Rejected",
      value: overview.rejectedApplications,
      description: "Applications rejected",
      icon: "bi-x-circle",
      iconClass: "text-danger",
    },
    {
      title: "Withdrawn",
      value: overview.withdrawnApplications,
      description: "Applications withdrawn",
      icon: "bi-arrow-counterclockwise",
      iconClass: "text-secondary",
    },
  ];

  if (isDashboardLoading && !dashboard) {
    return (
      <main className="container py-5">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>

          <p className="text-secondary mt-3 mb-0">
            Loading your recruiter dashboard...
          </p>
        </div>
      </main>
    );
  }

  if (dashboardError && !dashboard) {
    return (
      <main className="container py-5">
        <div className="alert alert-danger d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
          <span>{dashboardError}</span>

          <button
            type="button"
            className="btn btn-outline-danger btn-sm"
            onClick={() => dispatch(fetchRecruiterDashboardThunk())}
          >
            Try Again
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="container py-4 py-lg-5">
      {/* Welcome section */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <p className="text-primary fw-semibold small mb-2">
            RECRUITER DASHBOARD
          </p>

          <h2 className="fw-bold mb-2">
            Welcome back, {firstName}!
          </h2>

          <p className="text-secondary mb-0">
            Manage your hiring activities and find the right candidates for your team.
          </p>
        </div>

        <Link to="/recruiter/jobs/new" className="btn btn-primary">
          <i className="bi bi-plus-lg me-2" />
          Post a Job
        </Link>
      </div>

      {/* Background refresh error */}
      {dashboardError && (
        <div className="alert alert-danger d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
          <span>{dashboardError}</span>

          <button
            type="button"
            className="btn btn-outline-danger btn-sm"
            onClick={() => dispatch(fetchRecruiterDashboardThunk())}
          >
            Try Again
          </button>
        </div>
      )}

      {/* Dashboard statistics */}
      <section className="mb-5">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="fw-bold mb-0">Hiring Overview</h5>

          {isDashboardLoading && (
            <span className="text-secondary small">
              Updating...
            </span>
          )}
        </div>

        <div className="row g-3">
          {statistics.map((statistic) => (
            <div
              className="col-12 col-sm-6 col-xl-3"
              key={statistic.title}
            >
              <RecruiterDashboardStatCard {...statistic} />
            </div>
          ))}
        </div>
      </section>

      {/* Recent applications */}
      <section className="card border-0 shadow-sm mb-5">
        <div className="card-body p-4">
          <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-2">
            <div>
              <h5 className="fw-bold mb-1">
                Recent Applications
              </h5>

              <p className="text-secondary small mb-0">
                Review the latest applications received for your jobs.
              </p>
            </div>

            <Link
              to="/recruiter/jobs"
              className="btn btn-sm btn-outline-primary"
            >
              Manage Jobs
            </Link>
          </div>

          {recentApplications.length > 0 ? (
            <div>
              {recentApplications.map((application) => (
                <RecruiterDashboardApplicationItem
                  key={application._id}
                  application={application}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-5">
              <i className="bi bi-inbox fs-1 text-secondary" />

              <h6 className="fw-bold mt-3">
                No applications yet
              </h6>

              <p className="text-secondary small mb-3">
                Applications will appear here when candidates apply to your jobs.
              </p>

              <Link
                to="/recruiter/jobs/new"
                className="btn btn-primary btn-sm"
              >
                Post Your First Job
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Quick access */}
      <section>
        <h5 className="fw-bold mb-3">Quick Access</h5>

        <div className="row g-3">
          <div className="col-12 col-md-6 col-xl-3">
            <RecruiterDashboardQuickLink
              to="/recruiter/jobs"
              icon="bi-briefcase"
              title="My Jobs"
              description="Manage your published and archived jobs."
            />
          </div>

          <div className="col-12 col-md-6 col-xl-3">
            <RecruiterDashboardQuickLink
              to="/recruiter/jobs/new"
              icon="bi-plus-circle"
              title="Post a Job"
              description="Create a new job listing to attract candidates."
            />
          </div>

          <div className="col-12 col-md-6 col-xl-3">
            <RecruiterDashboardQuickLink
              to="/recruiter/profile"
              icon="bi-building"
              title="Company Profile"
              description="Manage your company information."
            />
          </div>

          <div className="col-12 col-md-6 col-xl-3">
            <RecruiterDashboardQuickLink
              to="/recruiter/hiring-assistant"
              icon="bi-robot"
              title="AI Hiring Assistant"
              description="Get AI assistance with your hiring workflow."
            />
          </div>
        </div>
      </section>
    </main>
  );
}

export default RecruiterDashboardPage;
