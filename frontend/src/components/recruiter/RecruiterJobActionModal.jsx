
const actionConfig = {
  archive: {
    title: "Archive Job",
    description: "Are you sure you want to archive this job?",
    warning:
      "This job will no longer be available as an active posting. You can still view and restore it under Archived Jobs.",
    buttonLabel: "Archive Job",
    buttonClass: "btn-warning",
    icon: "bi-archive",
    loadingLabel: "Archiving...",
  },
  restore: {
    title: "Restore Job",
    description: "Are you sure you want to restore this job?",
    warning:
      "This job will be moved back to Active Jobs. Applicants can discover it again if its application deadline has not passed.",
    buttonLabel: "Restore Job",
    buttonClass: "btn-success",
    icon: "bi-arrow-counterclockwise",
    loadingLabel: "Restoring...",
  },
  delete: {
    title: "Delete Job Permanently",
    description: "Are you sure you want to permanently delete this job?",
    warning:
      "This action cannot be undone. Jobs with existing applications cannot be permanently deleted. Archive those jobs instead.",
    buttonLabel: "Delete Permanently",
    buttonClass: "btn-danger",
    icon: "bi-trash",
    loadingLabel: "Deleting...",
  },
};

function RecruiterJobActionModal({
  job,
  actionType,
  isLoading,
  error,
  onClose,
  onConfirm,
}) {
  if (!job || !actionType) return null;

  const config = actionConfig[actionType];

  if (!config) return null;

  return (
    <>
      <div
        className="modal fade show d-block"
        tabIndex="-1"
        role="dialog"
        aria-modal="true"
        aria-labelledby="jobActionModalTitle"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 shadow">
            <div className="modal-header">
              <h5
                className="modal-title fw-semibold"
                id="jobActionModalTitle"
              >
                {config.title}
              </h5>

              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={onClose}
                disabled={isLoading}
              />
            </div>

            <div className="modal-body">
              <p className="mb-2">{config.description}</p>

              <p className="fw-semibold mb-3">{job.title}</p>

              <div className="alert alert-warning mb-0">
                <i className="bi bi-info-circle me-2" />
                {config.warning}
              </div>

              {error && (
                <div className="alert alert-danger mt-3 mb-0">
                  {error}
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={onClose}
                disabled={isLoading}
              >
                Cancel
              </button>

              <button
                type="button"
                className={`btn ${config.buttonClass}`}
                onClick={onConfirm}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                    />
                    {config.loadingLabel}
                  </>
                ) : (
                  <>
                    <i className={`bi ${config.icon} me-2`} />
                    {config.buttonLabel}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="modal-backdrop fade show" />
    </>
  );
}

export default RecruiterJobActionModal;
