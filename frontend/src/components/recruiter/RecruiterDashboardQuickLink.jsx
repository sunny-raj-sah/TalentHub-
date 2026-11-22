
import { Link } from "react-router-dom";

function RecruiterDashboardQuickLink({
  to,
  icon,
  title,
  description,
}) {
  return (
    <Link
      to={to}
      className="card border-0 shadow-sm text-decoration-none h-100"
    >
      <div className="card-body p-4">
        <i className={`bi ${icon} fs-3 text-primary`} />

        <h6 className="fw-bold text-dark mt-3 mb-1">
          {title}
        </h6>

        <p className="text-secondary small mb-0">
          {description}
        </p>
      </div>
    </Link>
  );
}

export default RecruiterDashboardQuickLink;
