
function ApplicationCoverLetter({ coverLetter }) {
  const hasCoverLetter = Boolean(coverLetter?.trim());

  return (
    <div className="card border-0 shadow-sm rounded-4">
      <div className="card-body p-4">
        <div className="d-flex align-items-center gap-2 mb-3">
          <div
            className="rounded-3 bg-primary-subtle text-primary d-flex align-items-center justify-content-center"
            style={{ width: 42, height: 42 }}
          >
            <i className="bi bi-chat-left-text fs-5" />
          </div>

          <div>
            <h5 className="fw-bold mb-0">Cover Letter</h5>
            <p className="text-muted small mb-0">
              Your submitted application message
            </p>
          </div>
        </div>

        {hasCoverLetter ? (
          <div
            className="bg-light rounded-3 p-3 p-md-4"
            style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}
          >
            <p className="text-secondary mb-0 lh-lg">
              {coverLetter}
            </p>
          </div>
        ) : (
          <div className="text-center bg-light rounded-3 p-4">
            <i className="bi bi-chat-square-text text-muted fs-2" />

            <p className="fw-semibold mt-2 mb-1">
              No cover letter submitted
            </p>

            <p className="text-muted small mb-0">
              You submitted this application without an additional message.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ApplicationCoverLetter;
