
import { Link } from "react-router-dom";

function SavedJobsEmptyState() {
  return (
    <div className="text-center py-5">
      <div className="mb-3">
        <i className="bi bi-bookmark-heart display-3 text-secondary" />
      </div>

      <h5 className="fw-bold mb-2">
        No saved jobs yet
      </h5>

      <p className="text-secondary mb-4">
        Save interesting opportunities and find them here whenever you're ready.
      </p>

      <Link to="/jobs" className="btn btn-primary">
        <i className="bi bi-search me-2" />
        Explore Jobs
      </Link>
    </div>
  );
}

export default SavedJobsEmptyState;
