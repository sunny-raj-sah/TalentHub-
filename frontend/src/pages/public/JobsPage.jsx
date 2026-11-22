 
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";

import { fetchJobsThunk } from "../../features/jobs/jobsThunks";
import JobCard from "../../components/jobs/JobCard";
import JobFilters from "../../components/jobs/JobFilters";

function JobsPageContent() {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  const {
    searchResults,
      pagination,
    isSearchLoading,
    searchError,
  } = useSelector((state) => state.jobs);

  // Search inputs initialize from URL parameters.
  const [keyword, setKeyword] = useState(
    searchParams.get("search") || ""
  );

  const [location, setLocation] = useState(
    searchParams.get("location") || ""
  );

  // Derive filters directly from URL parameters.
  const filters = {
    employmentType: searchParams.get("employmentType") || "",
    workMode: searchParams.get("workMode") || "",
  };

  const queryString = searchParams.toString();

  // Fetch jobs whenever URL query parameters change.
  useEffect(() => {
    const params = Object.fromEntries(
      new URLSearchParams(queryString)
    );

    dispatch(fetchJobsThunk(params));
  }, [dispatch, queryString]);

  // Search jobs while preserving active filters.
  const handleSearch = (event) => {
    event.preventDefault();

    const params = new URLSearchParams(searchParams);

    if (keyword.trim()) {
      params.set("search", keyword.trim());
    } else {
      params.delete("search");
    }

    if (location.trim()) {
      params.set("location", location.trim());
    } else {
      params.delete("location");
    }

    params.delete("page");

    setSearchParams(params);
  };

  // Clear keyword and location while preserving filters.
  const handleClearSearch = () => {
    setKeyword("");
    setLocation("");

    const params = new URLSearchParams(searchParams);

    params.delete("search");
    params.delete("location");
    params.delete("page");

    setSearchParams(params);
  };

  // Retry the current search.
  const handleRetry = () => {
    const params = Object.fromEntries(
      new URLSearchParams(queryString)
    );

    dispatch(fetchJobsThunk(params));
  };

  // Update an individual filter.
  const handleFilterChange = (name, value) => {
    const params = new URLSearchParams(searchParams);

    if (value) {
      params.set(name, value);
    } else {
      params.delete(name);
    }

    params.delete("page");

    setSearchParams(params);
  };

  // Clear filters while preserving keyword and location.
  const handleClearFilters = () => {
    const params = new URLSearchParams(searchParams);

    params.delete("employmentType");
    params.delete("workMode");
    params.delete("page");

    setSearchParams(params);
  };
  const handleSortChange = (event) => {
  const params = new URLSearchParams(searchParams);

  params.set("sort", event.target.value);
  params.delete("page");

  setSearchParams(params);
};
const handlePageChange = (page) => {
  const params = new URLSearchParams(searchParams);

  params.set("page", String(page));

  setSearchParams(params);
};
  return (
    <div className="container py-5">
      {/* Page heading */}
      <div className="mb-4">
        <span className="text-primary text-uppercase fw-semibold small">
          Find your next opportunity
        </span>

        <h1 className="fw-bold mt-2 mb-2">
          Explore Jobs
        </h1>

        <p className="text-secondary mb-0">
          Discover opportunities that match your skills and career goals.
        </p>
      </div>

      {/* Search section */}
      <div className="bg-white border rounded-4 shadow-sm p-3 p-md-4 mb-5">
        <form onSubmit={handleSearch}>
          <div className="row g-3 align-items-end">
            <div className="col-md-5">
              <label htmlFor="jobSearch" className="form-label fw-semibold">
                Job title or keyword
              </label>

              <div className="input-group">
                <span className="input-group-text bg-white">
                  <i className="bi bi-search text-secondary" />
                </span>

                <input
                  id="jobSearch"
                  type="text"
                  className="form-control"
                  placeholder="e.g. React Developer"
                  value={keyword}
                  onChange={(event) => setKeyword(event.target.value)}
                />
              </div>
            </div>

            <div className="col-md-4">
              <label htmlFor="jobLocation" className="form-label fw-semibold">
                Location
              </label>

              <div className="input-group">
                <span className="input-group-text bg-white">
                  <i className="bi bi-geo-alt text-secondary" />
                </span>

                <input
                  id="jobLocation"
                  type="text"
                  className="form-control"
                  placeholder="e.g. Bangalore"
                  value={location}
                  onChange={(event) => setLocation(event.target.value)}
                />
              </div>
            </div>

            <div className="col-md-3 d-flex gap-2">
              <button
                type="submit"
                className="btn btn-primary fw-semibold flex-grow-1"
              >
                <i className="bi bi-search me-2" />
                Search
              </button>

              <button
                type="button"
                className="btn btn-light border"
                onClick={handleClearSearch}
                title="Clear search"
                aria-label="Clear search"
              >
                <i className="bi bi-x-lg" />
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Filters and job results */}
      <div className="row g-4">
        {/* Filters sidebar */}
        <aside className="col-lg-3">
          <div className="position-sticky" style={{ top: "24px" }}>
            <JobFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              onClear={handleClearFilters}
            />
          </div>
        </aside>

        {/* Job results */}
        <section className="col-lg-9">
          {/* Results heading */}
         
<div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
  <div>
    <h4 className="fw-bold mb-1">
      Available Opportunities
    </h4>

    <p className="text-secondary small mb-0">
      {isSearchLoading
        ? "Finding matching opportunities..."
        : `${searchResults.length} jobs displayed`}
    </p>
  </div>

  <div className="d-flex align-items-center gap-2">
    <label
      htmlFor="jobSort"
      className="text-secondary small fw-semibold text-nowrap"
    >
      Sort by:
    </label>

    <select
      id="jobSort"
      className="form-select form-select-sm"
      style={{ width: "180px" }}
      value={searchParams.get("sort") || "NEWEST"}
      onChange={handleSortChange}
    >
      <option value="NEWEST">Newest first</option>
      <option value="OLDEST">Oldest first</option>
      <option value="SALARY_HIGH">Highest salary</option>
      <option value="SALARY_LOW">Lowest salary</option>
    </select>
  </div>
</div>


          {/* Loading state */}
          {isSearchLoading && (
            <div className="row g-4">
              {Array.from({ length: 6 }).map((_, index) => (
                <div className="col-md-6 col-xl-4" key={index}>
                  <div className="card border rounded-4 h-100">
                    <div className="card-body p-4 placeholder-glow">
                      <span className="placeholder col-4 mb-3" />
                      <span className="placeholder col-9 mb-3" />
                      <span className="placeholder col-6 mb-4" />
                      <span className="placeholder col-10 mb-2" />
                      <span className="placeholder col-7" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Error state */}
          {!isSearchLoading && searchError && (
            <div className="bg-white border rounded-4 text-center p-5">
              <i className="bi bi-exclamation-circle text-danger fs-1" />

              <h5 className="fw-bold mt-3">
                Unable to load jobs
              </h5>

              <p className="text-secondary">
                {searchError}
              </p>

              <button
                type="button"
                className="btn btn-primary"
                onClick={handleRetry}
              >
                <i className="bi bi-arrow-clockwise me-2" />
                Try Again
              </button>
            </div>
          )}

          {/* Empty state */}
          {!isSearchLoading &&
            !searchError &&
            searchResults.length === 0 && (
              <div className="bg-white border rounded-4 text-center p-5">
                <i className="bi bi-search text-secondary fs-1" />

                <h5 className="fw-bold mt-3">
                  No jobs found
                </h5>

                <p className="text-secondary mb-0">
                  Try changing your search keywords, location, or filters.
                </p>
              </div>
            )}

          {/* Job cards */}
          
{/* Job cards */}
{!isSearchLoading &&
  !searchError &&
  searchResults.length > 0 && (
    <>
      <div className="row g-4">
        {searchResults.map((job) => (
          <div className="col-md-6 col-xl-4" key={job._id}>
            <JobCard job={job} />
          </div>
        ))}
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center gap-3 mt-5">

          <p className="text-secondary small mb-0">
            Showing page{" "}
            <strong>{pagination.currentPage}</strong>{" "}
            of{" "}
            <strong>{pagination.totalPages}</strong>
            {" "}({pagination.totalJobs} jobs)
          </p>

          <nav aria-label="Job listings pagination">
            <ul className="pagination mb-0">

              <li
                className={`page-item ${
                  !pagination.hasPreviousPage ? "disabled" : ""
                }`}
              >
                <button
                  type="button"
                  className="page-link"
                  disabled={!pagination.hasPreviousPage || isSearchLoading}
                  onClick={() =>
                    handlePageChange(pagination.currentPage - 1)
                  }
                >
                  <i className="bi bi-chevron-left me-1" />
                  Previous
                </button>
              </li>

              <li className="page-item active">
                <span className="page-link">
                  {pagination.currentPage}
                </span>
              </li>

              <li
                className={`page-item ${
                  !pagination.hasNextPage ? "disabled" : ""
                }`}
              >
                <button
                  type="button"
                  className="page-link"
                  disabled={!pagination.hasNextPage || isSearchLoading}
                  onClick={() =>
                    handlePageChange(pagination.currentPage + 1)
                  }
                >
                  Next
                  <i className="bi bi-chevron-right ms-1" />
                </button>
              </li>

            </ul>
          </nav>
        </div>
      )}
    </>
  )}

        </section>
      </div>
    </div>
  );
}

// Remount content when URL query parameters change.
// This keeps search inputs synchronized with browser navigation.
function JobsPage() {
  const [searchParams] = useSearchParams();

  return (
    <JobsPageContent key={searchParams.toString()} />
  );
}

export default JobsPage;
