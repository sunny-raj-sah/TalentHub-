
function RecruiterJobsPagination({ pagination, onPageChange }) {
  if (!pagination || pagination.totalPages <= 1) {
    return null;
  }

  const {
    currentPage,
    totalPages,
    hasNextPage,
    hasPreviousPage,
    totalJobs,
    limit,
  } = pagination;

  const startItem = (currentPage - 1) * limit + 1;
  const endItem = Math.min(currentPage * limit, totalJobs);

  const getPageNumbers = () => {
    const pages = [];
    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, currentPage + 2);

    for (let page = start; page <= end; page += 1) {
      pages.push(page);
    }

    return pages;
  };

  return (
    <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3 mt-4">
      <small className="text-muted">
        Showing {startItem}–{endItem} of {totalJobs} jobs
      </small>

      <nav aria-label="Recruiter jobs pagination">
        <ul className="pagination pagination-sm mb-0">
          <li className={`page-item ${!hasPreviousPage ? "disabled" : ""}`}>
            <button
              type="button"
              className="page-link"
              disabled={!hasPreviousPage}
              onClick={() => onPageChange(currentPage - 1)}
            >
              Previous
            </button>
          </li>

          {getPageNumbers().map((page) => (
            <li
              key={page}
              className={`page-item ${
                page === currentPage ? "active" : ""
              }`}
            >
              <button
                type="button"
                className="page-link"
                aria-current={page === currentPage ? "page" : undefined}
                onClick={() => onPageChange(page)}
              >
                {page}
              </button>
            </li>
          ))}

          <li className={`page-item ${!hasNextPage ? "disabled" : ""}`}>
            <button
              type="button"
              className="page-link"
              disabled={!hasNextPage}
              onClick={() => onPageChange(currentPage + 1)}
            >
              Next
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default RecruiterJobsPagination;
