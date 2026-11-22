
function RecruiterDashboardStatCard({
  title,
  value,
  description,
  icon,
  iconClass = "text-primary",
}) {
  return (
    <div className="card border-0 shadow-sm h-100">
      <div className="card-body p-4">
        <div className="d-flex justify-content-between align-items-start gap-3">
          <div>
            <p className="text-secondary small mb-2">{title}</p>

            <h3 className="fw-bold mb-1">{value ?? 0}</h3>

            <p className="text-secondary small mb-0">
              {description}
            </p>
          </div>

          <div
            className={`fs-3 ${iconClass}`}
            aria-hidden="true"
          >
            <i className={`bi ${icon}`} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecruiterDashboardStatCard;
