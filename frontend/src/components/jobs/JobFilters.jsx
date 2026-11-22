function JobFilters({ filters, onFilterChange, onClear }) {
  const handleChange = (event) => {
    const { name, value } = event.target;

    onFilterChange(name, value);
  };

  return (
    <div className="card border rounded-4 shadow-sm">
      <div className="card-body p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h5 className="fw-bold mb-0">
            <i className="bi bi-sliders me-2 text-primary" />
            Filters
          </h5>

          <button
            type="button"
            className="btn btn-link btn-sm text-decoration-none p-0"
            onClick={onClear}
          >
            Clear all
          </button>
        </div>

        {/* Employment type */}
        <div className="mb-4">
          <label
            htmlFor="employmentType"
            className="form-label fw-semibold"
          >
            Employment Type
          </label>

          <select
            id="employmentType"
            name="employmentType"
            className="form-select"
            value={filters.employmentType}
            onChange={handleChange}
          >
            <option value="">All employment types</option>
            <option value="FULL_TIME">Full Time</option>
            <option value="PART_TIME">Part Time</option>
            <option value="CONTRACT">Contract</option>
            <option value="INTERNSHIP">Internship</option>
          </select>
        </div>

        {/* Work mode */}
        <div className="mb-2">
          <label
            htmlFor="workMode"
            className="form-label fw-semibold"
          >
            Work Mode
          </label>

          <select
            id="workMode"
            name="workMode"
            className="form-select"
            value={filters.workMode}
            onChange={handleChange}
          >
            <option value="">All work modes</option>
            <option value="ONSITE">On-site</option>
            <option value="REMOTE">Remote</option>
            <option value="HYBRID">Hybrid</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default JobFilters;