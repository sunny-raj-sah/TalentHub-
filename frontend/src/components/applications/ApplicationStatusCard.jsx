
const statusConfig = {
  PENDING: {
    label: "Under Review",
    icon: "bi-hourglass-split",
    color: "warning",
    message:
      "Your application has been submitted successfully and is waiting for the recruiter's review.",
  },
  SHORTLISTED: {
    label: "Shortlisted",
    icon: "bi-check-circle",
    color: "success",
    message:
      "Congratulations! The recruiter has shortlisted your application.",
  },
  REJECTED: {
    label: "Not Selected",
    icon: "bi-x-circle",
    color: "danger",
    message:
      "Unfortunately, you were not selected for this position.",
  },
  WITHDRAWN: {
    label: "Withdrawn",
    icon: "bi-arrow-counterclockwise",
    color: "secondary",
    message:
      "You have withdrawn this application. It cannot be submitted again for the same job.",
  },
};

const formatDate = (date) => {
  if (!date) return "Not available";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

function ApplicationStatusCard({ application }) {
  const status = statusConfig[application?.status] || {
    label: application?.status || "Unknown",
    icon: "bi-info-circle",
    color: "secondary",
    message: "Application status information is currently unavailable.",
  };

  return (
    <div className="card border-0 shadow-sm rounded-4">
      <div className="card-body p-4">
        <div className="d-flex align-items-start justify-content-between flex-wrap gap-3">
          <div>
            <p className="text-muted small fw-semibold mb-2">
              APPLICATION STATUS
            </p>

            <div className="d-flex align-items-center gap-2">
              <span
                className={`badge text-bg-${status.color} rounded-pill px-3 py-2`}
              >
                <i className={`bi ${status.icon} me-2`} />
                {status.label}
              </span>
            </div>
          </div>

          <div className="text-md-end">
            <p className="text-muted small mb-1">
              Application ID
            </p>
            <span className="small fw-semibold text-break">
              {application?._id || "Not available"}
            </span>
          </div>
        </div>

        <div className="alert alert-light border rounded-3 mt-4 mb-3">
          <div className="d-flex align-items-start gap-2">
            <i className={`bi ${status.icon} mt-1`} />
            <p className="small mb-0">{status.message}</p>
          </div>
        </div>

        <div className="row g-3">
          <div className="col-sm-6">
            <div className="bg-light rounded-3 p-3 h-100">
              <p className="text-muted small mb-1">
                Applied On
              </p>
              <p className="fw-semibold mb-0">
                {formatDate(application?.appliedAt)}
              </p>
            </div>
          </div>

          <div className="col-sm-6">
            <div className="bg-light rounded-3 p-3 h-100">
              <p className="text-muted small mb-1">
                Last Status Update
              </p>
              <p className="fw-semibold mb-0">
                {formatDate(application?.statusUpdatedAt)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ApplicationStatusCard;
