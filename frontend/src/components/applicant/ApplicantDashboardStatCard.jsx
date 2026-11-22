
function ApplicantDashboardStatCard({
  title,
  value,
  description,
  icon,
  iconClass = "text-primary",
}) {
  return (
    <div className="card border-0 shadow-sm h-100">
      <div className="card-body p-4">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div>
            <p className="text-secondary small fw-semibold mb-1">
              {title}
            </p>

            <h3 className="fw-bold mb-0">{value}</h3>
          </div>

          <div
            className={`rounded-3 bg-light p-3 ${iconClass}`}
            style={{ fontSize: "1.25rem" }}
          >
            <i className={`bi ${icon}`} />
          </div>
        </div>

        <p className="text-secondary small mb-0">
          {description}
        </p>
      </div>
    </div>
  );
}

export default ApplicantDashboardStatCard;
