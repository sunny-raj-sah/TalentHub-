
import { Link } from "react-router-dom";

const getStatusClass = (status) => {
  const normalizedStatus = status?.toUpperCase();

  const statusClasses = {
    PENDING: "bg-warning-subtle text-warning-emphasis",
    REVIEWING: "bg-info-subtle text-info-emphasis",
    UNDER_REVIEW: "bg-info-subtle text-info-emphasis",
    SHORTLISTED: "bg-success-subtle text-success-emphasis",
    ACCEPTED: "bg-success-subtle text-success-emphasis",
    REJECTED: "bg-danger-subtle text-danger-emphasis",
    WITHDRAWN: "bg-secondary-subtle text-secondary-emphasis",
  };

  return (
    statusClasses[normalizedStatus] ||
    "bg-secondary-subtle text-secondary-emphasis"
  );
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

function ApplicantDashboardApplicationItem({ application }) {
  const job =
    application.job ||
    application.jobId ||
    application.jobDetails ||
    application.jobSnapshot ||
    {};

  const jobTitle =
    job.title ||
    application.jobTitle ||
    "Job application";

  const companyName =
    job.companyName ||
    job.company?.name ||
    job.company ||
    application.companyName ||
    "Company";

  const status = application.status || "PENDING";

  return (
    <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 border-bottom py-3">
      <div className="flex-grow-1">
        <h6 className="fw-bold mb-1">{jobTitle}</h6>

        <p className="text-secondary small mb-1">
          <i className="bi bi-building me-2" />
          {typeof companyName === "string"
            ? companyName
            : "Company"}
        </p>

        <p className="text-secondary small mb-0">
          <i className="bi bi-calendar3 me-2" />
          Applied on {formatDate(
            application.createdAt || application.appliedAt
          )}
        </p>
      </div>

      <div className="d-flex align-items-center gap-3">
        <span
          className={`badge rounded-pill px-3 py-2 ${getStatusClass(
            status
          )}`}
        >
          {status.replaceAll("_", " ")}
        </span>

        <Link
          to={`/applicant/applications/${application._id}`}
          className="btn btn-sm btn-outline-primary"
        >
          View
        </Link>
      </div>
    </div>
  );
}

export default ApplicantDashboardApplicationItem;
