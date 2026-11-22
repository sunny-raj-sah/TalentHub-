
import { Link } from "react-router-dom";

function ApplicationActions({
  application,
  onWithdraw,
  isWithdrawing = false,
}) {
  const canWithdraw = ["PENDING", "SHORTLISTED"].includes(
    application?.status
  );

  const handleWithdraw = () => {
    const confirmed = window.confirm(
      "Are you sure you want to withdraw this application? This action cannot be undone."
    );

    if (confirmed) {
      onWithdraw?.();
    }
  };

  return (
    <div className="d-flex flex-column flex-sm-row align-items-stretch align-items-sm-center justify-content-between gap-3">
      <Link
        to="/applicant/applications"
        className="btn btn-outline-secondary rounded-pill px-4"
      >
        <i className="bi bi-arrow-left me-2" />
        My Applications
      </Link>

      <div className="d-flex flex-column flex-sm-row gap-2">
        {application?.job?._id && (
          <Link
            to={`/jobs/${application.job._id}`}
            className="btn btn-outline-primary rounded-pill px-4"
          >
            <i className="bi bi-briefcase me-2" />
            View Job
          </Link>
        )}

        {canWithdraw && (
          <button
            type="button"
            className="btn btn-outline-danger rounded-pill px-4"
            onClick={handleWithdraw}
            disabled={isWithdrawing}
          >
            {isWithdrawing ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  aria-hidden="true"
                />
                Withdrawing...
              </>
            ) : (
              <>
                <i className="bi bi-x-circle me-2" />
                Withdraw Application
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

export default ApplicationActions;
