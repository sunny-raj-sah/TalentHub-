
function RecruiterApplicationsFilters({
  status,
  sort,
  onStatusChange,
  onSortChange,
}) {
  return (
    <div className="card border-0 shadow-sm mb-4">
      <div className="card-body">
        <div className="row g-3">
          <div className="col-md-6">
            <label htmlFor="applicationStatus" className="form-label">
              Filter by status
            </label>

            <select
              id="applicationStatus"
              className="form-select"
              value={status}
              onChange={(event) => onStatusChange(event.target.value)}
            >
              <option value="ALL">All applications</option>
              <option value="PENDING">Pending</option>
              <option value="SHORTLISTED">Shortlisted</option>
              <option value="REJECTED">Rejected</option>
              <option value="WITHDRAWN">Withdrawn</option>
            </select>
          </div>

          <div className="col-md-6">
            <label htmlFor="applicationSort" className="form-label">
              Sort by application date
            </label>

            <select
              id="applicationSort"
              className="form-select"
              value={sort}
              onChange={(event) => onSortChange(event.target.value)}
            >
              <option value="NEWEST">Newest first</option>
              <option value="OLDEST">Oldest first</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecruiterApplicationsFilters;
