
import { Link } from "react-router-dom";

const formatSalary = (salary) => {
  if (!salary) return "Not disclosed";

  const { min, max, currency = "INR", period = "YEARLY" } = salary;

  const formatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  });

  if (min && max) {
    return `${formatter.format(min)} - ${formatter.format(max)} / ${period.toLowerCase()}`;
  }

  if (min) return `From ${formatter.format(min)}`;
  if (max) return `Up to ${formatter.format(max)}`;

  return "Not disclosed";
};

const formatLabel = (value) => {
  if (!value) return "Not specified";

  return value
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

function ApplicationJobCard({ job, recruiter }) {
  if (!job) {
    return (
      <div className="card border-0 shadow-sm rounded-4">
        <div className="card-body p-4">
          <p className="text-muted mb-0">
            The original job posting is no longer available.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card border-0 shadow-sm rounded-4">
      <div className="card-body p-4">
        <div className="d-flex align-items-start gap-3">
          <div
            className="rounded-3 bg-primary-subtle text-primary d-flex align-items-center justify-content-center flex-shrink-0"
            style={{ width: 52, height: 52 }}
          >
            <i className="bi bi-briefcase fs-4" />
          </div>

          <div className="flex-grow-1 min-w-0">
            <h5 className="fw-bold mb-1 text-break">
              {job.title}
            </h5>

            <p className="text-muted small mb-2">
              <i className="bi bi-building me-2" />
              {recruiter?.name || "Recruiter"}
            </p>

            {job.status && (
              <span
                className={`badge rounded-pill ${
                  job.status === "ACTIVE"
                    ? "text-bg-success"
                    : "text-bg-secondary"
                }`}
              >
                {formatLabel(job.status)}
              </span>
            )}
          </div>
        </div>

        <hr className="my-4" />

        <div className="row g-3">
          <div className="col-sm-6">
            <div className="d-flex gap-2">
              <i className="bi bi-geo-alt text-primary" />
              <div>
                <p className="text-muted small mb-1">Location</p>
                <p className="small fw-semibold mb-0">
                  {job.location || "Not specified"}
                </p>
              </div>
            </div>
          </div>

          <div className="col-sm-6">
            <div className="d-flex gap-2">
              <i className="bi bi-clock text-primary" />
              <div>
                <p className="text-muted small mb-1">
                  Employment Type
                </p>
                <p className="small fw-semibold mb-0">
                  {formatLabel(job.employmentType)}
                </p>
              </div>
            </div>
          </div>

          <div className="col-sm-6">
            <div className="d-flex gap-2">
              <i className="bi bi-laptop text-primary" />
              <div>
                <p className="text-muted small mb-1">Work Mode</p>
                <p className="small fw-semibold mb-0">
                  {formatLabel(job.workMode)}
                </p>
              </div>
            </div>
          </div>

          <div className="col-sm-6">
            <div className="d-flex gap-2">
              <i className="bi bi-currency-rupee text-primary" />
              <div>
                <p className="text-muted small mb-1">Salary</p>
                <p className="small fw-semibold mb-0">
                  {formatSalary(job.salary)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <Link
            to={`/jobs/${job._id}`}
            className="btn btn-outline-primary btn-sm rounded-pill px-3"
          >
            View Job Details
            <i className="bi bi-arrow-up-right ms-2" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ApplicationJobCard;
