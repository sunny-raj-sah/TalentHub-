
import { Link } from "react-router-dom";

function SavedJobCard({ bookmark, onRemove, isRemoving }) {
  const job = bookmark.job;

  if (!job) return null;

  const recruiterName =
    typeof job.recruiter === "object"
      ? job.recruiter?.name
      : null;

  const formatDate = (date) => {
    if (!date) return "Not specified";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Not specified";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatSalary = (salary) => {
    if (!salary) return "Salary not specified";

    if (typeof salary === "string") return salary;

    if (typeof salary === "object") {
      const min = salary.min;
      const max = salary.max;

      if (min && max) return `${min} - ${max}`;
      if (min) return `From ${min}`;
      if (max) return `Up to ${max}`;
    }

    return "Salary not specified";
  };

  return (
    <div className="card border-0 shadow-sm h-100">
      <div className="card-body p-4 d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start gap-3">
          <div>
            <h5 className="fw-bold mb-1">{job.title}</h5>

            <p className="text-secondary small mb-0">
              <i className="bi bi-building me-2" />
              {recruiterName || "Company"}
            </p>
          </div>

          <button
            type="button"
            className="btn btn-sm btn-outline-danger"
            onClick={() => onRemove(job._id)}
            disabled={isRemoving}
            title="Remove saved job"
          >
            {isRemoving ? (
              <span
                className="spinner-border spinner-border-sm"
                role="status"
              />
            ) : (
              <i className="bi bi-bookmark-x" />
            )}
          </button>
        </div>

        <div className="d-flex flex-wrap gap-2 my-3">
          {job.location && (
            <span className="badge bg-light text-secondary">
              <i className="bi bi-geo-alt me-1" />
              {job.location}
            </span>
          )}

          {job.workMode && (
            <span className="badge bg-light text-secondary">
              {job.workMode}
            </span>
          )}

          {job.employmentType && (
            <span className="badge bg-light text-secondary">
              {job.employmentType}
            </span>
          )}
        </div>

        <p className="text-secondary small mb-3">
          {job.description
            ? `${job.description.slice(0, 140)}${
                job.description.length > 140 ? "..." : ""
              }`
            : "Explore this opportunity and learn more about the role."}
        </p>

        <div className="mt-auto">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <span className="small fw-semibold">
              {formatSalary(job.salary)}
            </span>

            <span className="text-secondary small">
              Deadline: {formatDate(job.applicationDeadline)}
            </span>
          </div>

          <Link
            to={`/jobs/${job._id}`}
            className="btn btn-outline-primary w-100"
          >
            View Job Details
            <i className="bi bi-arrow-right ms-2" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SavedJobCard;
