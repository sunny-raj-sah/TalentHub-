import { Link } from "react-router-dom";

function formatLabel(value) {
  if (!value) return "";

  return value
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatSalary(salary) {
  if (!salary || (!salary.min && !salary.max)) {
    return "Salary not disclosed";
  }

  const currency = salary.currency || "INR";

  const formatAmount = (amount) =>
    new Intl.NumberFormat("en-IN", {
      maximumFractionDigits: 0,
    }).format(amount);

  if (salary.min && salary.max) {
    return `${currency} ${formatAmount(salary.min)} – ${formatAmount(salary.max)}`;
  }

  if (salary.min) {
    return `From ${currency} ${formatAmount(salary.min)}`;
  }

  return `Up to ${currency} ${formatAmount(salary.max)}`;
}

function formatExperience(experience) {
  if (!experience) return "Experience not specified";

  const { min, max } = experience;

  if (min != null && max != null) {
    return `${min}–${max} years experience`;
  }

  if (min != null) return `${min}+ years experience`;
  if (max != null) return `Up to ${max} years experience`;

  return "Experience not specified";
}

function formatPostedDate(date) {
  if (!date) return "";

  const postedDate = new Date(date);

  if (Number.isNaN(postedDate.getTime())) return "";

  return postedDate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function JobCard({ job }) {
  if (!job) return null;

  return (
    <article className="card h-100 border rounded-4 shadow-sm job-card">
      <div className="card-body p-4 d-flex flex-column">
        {/* Company and posting date */}
        <div className="d-flex align-items-start justify-content-between gap-3 mb-3">
          <div className="d-flex align-items-center gap-3">
            <div
              className="rounded-3 bg-primary-subtle text-primary d-flex align-items-center justify-content-center fw-bold"
              style={{
                width: "46px",
                height: "46px",
                flexShrink: 0,
              }}
            >
              {job.recruiter?.name?.charAt(0)?.toUpperCase() || "C"}
            </div>

            <div>
              <p className="fw-semibold mb-0">
                {job.recruiter?.name || "Company"}
              </p>

              <small className="text-secondary">
                {formatPostedDate(job.createdAt)}
              </small>
            </div>
          </div>

          {job.isFeatured && (
            <span className="badge rounded-pill bg-primary-subtle text-primary">
              Featured
            </span>
          )}
        </div>

        {/* Job information */}
        <h5 className="fw-bold mb-2">
          <Link
            to={`/jobs/${job._id}`}
            className="text-decoration-none text-dark"
          >
            {job.title}
          </Link>
        </h5>

        <p className="text-secondary small mb-3">
          <i className="bi bi-geo-alt me-2" />
          {job.location || "Location not specified"}
        </p>

        {/* Job attributes */}
        <div className="d-flex flex-wrap gap-2 mb-3">
          {job.employmentType && (
            <span className="badge bg-light text-secondary border fw-medium">
              {formatLabel(job.employmentType)}
            </span>
          )}

          {job.workMode && (
            <span className="badge bg-light text-secondary border fw-medium">
              {formatLabel(job.workMode)}
            </span>
          )}
        </div>

        <p className="text-secondary small mb-3">
          {formatExperience(job.experience)}
        </p>

        {/* Skills */}
        {Array.isArray(job.skills) && job.skills.length > 0 && (
          <div className="d-flex flex-wrap gap-2 mb-4">
            {job.skills.slice(0, 4).map((skill, index) => (
              <span
                key={`${skill}-${index}`}
                className="badge rounded-pill bg-primary-subtle text-primary fw-medium"
              >
                {skill}
              </span>
            ))}

            {job.skills.length > 4 && (
              <span className="badge rounded-pill bg-light text-secondary border">
                +{job.skills.length - 4} more
              </span>
            )}
          </div>
        )}

        {/* Salary and details link */}
        <div className="mt-auto pt-3 border-top d-flex align-items-center justify-content-between gap-2">
          <div>
            <small className="text-secondary d-block mb-1">
              Salary range
            </small>

            <span className="fw-bold text-dark small">
              {formatSalary(job.salary)}
            </span>
          </div>

          <Link
            to={`/jobs/${job._id}`}
            className="btn btn-outline-primary btn-sm fw-semibold"
          >
            View Job
            <i className="bi bi-arrow-up-right ms-2" />
          </Link>
        </div>
      </div>
    </article>
  );
}

export default JobCard;