
import { Link } from "react-router-dom";

const formatLabel = (value = "") =>
  value
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const formatSalary = (salary) => {
  if (!salary) return "Not specified";

  const currency = salary.currency || "INR";

  const formatAmount = (amount) =>
    new Intl.NumberFormat("en-IN", {
      maximumFractionDigits: 0,
    }).format(amount);

  return `${currency} ${formatAmount(salary.min)} - ${formatAmount(salary.max)}`;
};

const formatExperience = (experience) => {
  if (!experience) return "Not specified";

  return `${experience.min} - ${experience.max} years`;
};

const formatDate = (date) => {
  if (!date) return "Not specified";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

function RecruiterJobCard({
  job,
  onArchive,
  onRestore,
  onDelete,
  isArchiving = false,
  isRestoring = false,
  isDeleting = false,
}) {
  const isActive = job.status === "ACTIVE";

  return (
    <div className="card border-0 shadow-sm mb-3">
      <div className="card-body p-4">
        <div className="d-flex flex-column flex-md-row justify-content-between gap-3">
          <div className="flex-grow-1">
            <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
              <h5 className="fw-semibold mb-0">{job.title}</h5>

              <span
                className={`badge ${
                  isActive ? "text-bg-success" : "text-bg-secondary"
                }`}
              >
                {formatLabel(job.status)}
              </span>
            </div>

            <div className="text-muted small d-flex flex-wrap gap-3 mb-3">
              <span>
                <i className="bi bi-geo-alt me-1" />
                {job.location}
              </span>

              <span>
                <i className="bi bi-briefcase me-1" />
                {formatLabel(job.employmentType)}
              </span>

              <span>
                <i className="bi bi-laptop me-1" />
                {formatLabel(job.workMode)}
              </span>
            </div>

            <div className="row g-3 mb-3">
              <div className="col-12 col-sm-6">
                <small className="text-muted d-block">Salary range</small>
                <span className="fw-medium">{formatSalary(job.salary)}</span>
              </div>

              <div className="col-12 col-sm-6">
                <small className="text-muted d-block">Experience</small>
                <span className="fw-medium">
                  {formatExperience(job.experience)}
                </span>
              </div>

              <div className="col-12 col-sm-6">
                <small className="text-muted d-block">Posted on</small>
                <span className="fw-medium">{formatDate(job.createdAt)}</span>
              </div>

              <div className="col-12 col-sm-6">
                <small className="text-muted d-block">
                  Application deadline
                </small>
                <span className="fw-medium">
                  {formatDate(job.applicationDeadline)}
                </span>
              </div>
            </div>

            {job.skills?.length > 0 && (
              <div>
                <small className="text-muted d-block mb-2">
                  Required skills
                </small>

                <div className="d-flex flex-wrap gap-2">
                  {job.skills.map((skill, index) => (
                    <span
                      key={`${skill}-${index}`}
                      className="badge bg-light text-dark border fw-normal"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="d-flex flex-row flex-wrap flex-md-column gap-2 align-items-start">
             <Link
              to={`/recruiter/jobs/${job._id}/applications`}
              className="btn btn-primary btn-sm text-nowrap"
            >
              <i className="bi bi-people me-1" />
              Applications
            </Link>
          
            {isActive ? (
              <>
                <button
                  type="button"
                  className="btn btn-outline-warning btn-sm text-nowrap"
                  onClick={() => onArchive?.(job)}
                  disabled={isArchiving || isRestoring || isDeleting}
                >
                  <i className="bi bi-archive me-1" />
                  Archive
                </button>
              </>
            ) : (
              <button
                type="button"
                className="btn btn-outline-success btn-sm text-nowrap"
                onClick={() => onRestore?.(job)}
                disabled={isArchiving || isRestoring || isDeleting}
              >
                <i className="bi bi-arrow-counterclockwise me-1" />
                Restore
              </button>
            )}
{isActive && (
              <Link
                to={`/recruiter/jobs/${job._id}/edit`}
                className="btn btn-outline-primary btn-sm"
              >
                <i className="bi bi-pencil me-1" />
                Edit
              </Link>
            )}
            <button
              type="button"
              className="btn btn-outline-danger btn-sm text-nowrap"
              onClick={() => onDelete?.(job)}
              disabled={isArchiving || isRestoring || isDeleting}
            >
              <i className="bi bi-trash me-1" />
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecruiterJobCard;
