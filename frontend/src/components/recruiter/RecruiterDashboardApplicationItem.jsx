
import { Link } from "react-router-dom";

const getStatusClass = (status) => {
  switch (status?.toUpperCase()) {
    case "SHORTLISTED":
      return "bg-success-subtle text-success";

    case "REJECTED":
      return "bg-danger-subtle text-danger";

    case "WITHDRAWN":
      return "bg-secondary-subtle text-secondary";

    case "REVIEWING":
    case "UNDER_REVIEW":
      return "bg-info-subtle text-info";

    case "PENDING":
    default:
      return "bg-warning-subtle text-warning-emphasis";
  }
};

const formatLabel = (value) => {
  if (!value) return "";

  return value
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const formatDate = (date) => {
  if (!date) return "Date unavailable";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Date unavailable";
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

function RecruiterDashboardApplicationItem({ application }) {
  const applicant = application.applicant;
  const job = application.job;

  const applicantName = applicant?.name || "Unknown applicant";
  const applicantEmail = applicant?.email || "Email unavailable";
  const jobTitle = job?.title || "Job no longer available";

  const status = application.status || "PENDING";

  return (
    <div className="border-bottom py-3">
      <div className="d-flex flex-column flex-md-row justify-content-between gap-3">
        <div className="min-w-0">
          <h6 className="fw-semibold mb-1">
            {applicantName}
          </h6>

          <p className="text-secondary small mb-2">
            {applicantEmail}
          </p>

          <p className="fw-semibold small mb-1">
            {jobTitle}
          </p>

          <div className="d-flex flex-wrap align-items-center gap-2 text-secondary small">
            {job?.location && (
              <span>
                <i className="bi bi-geo-alt me-1" />
                {job.location}
              </span>
            )}

            {job?.employmentType && (
              <span>{formatLabel(job.employmentType)}</span>
            )}

            {job?.workMode && (
              <span>{formatLabel(job.workMode)}</span>
            )}
          </div>
        </div>

        <div className="d-flex flex-row flex-md-column align-items-center align-items-md-end justify-content-between gap-2 flex-shrink-0">
          <span
            className={`badge rounded-pill ${getStatusClass(status)}`}
          >
            {formatLabel(status)}
          </span>

          <span className="text-secondary small">
            {formatDate(application.appliedAt || application.createdAt)}
          </span>

          {job?._id && (
            <Link
              to={`/recruiter/jobs/${job._id}/applications`}
              className="btn btn-sm btn-outline-primary"
            >
              View Applications
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default RecruiterDashboardApplicationItem;
