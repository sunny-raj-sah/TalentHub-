
function RecruiterApplicationsPagination({ pagination, onPageChange }) {
  if (!pagination || pagination.totalPages <= 1) return null;

  const { currentPage, totalPages, totalApplications } = pagination;

  return (
    <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3 mt-4">
      <small className="text-muted">
        Page {currentPage} of {totalPages} · {totalApplications} applications
      </small>

      <nav aria-label="Applications pagination">
        <ul className="pagination pagination-sm mb-0">
          <li className={`page-item ${!pagination.hasPreviousPage ? "disabled" : ""}`}>
            <button
              type="button"
              className="page-link"
              disabled={!pagination.hasPreviousPage}
              onClick={() => onPageChange(currentPage - 1)}
            >
              Previous
            </button>
          </li>

          {Array.from({ length: totalPages }, (_, index) => index + 1).map(
            (page) => (
              <li
                key={page}
                className={`page-item ${page === currentPage ? "active" : ""}`}
              >
                <button
                  type="button"
                  className="page-link"
                  onClick={() => onPageChange(page)}
                >
                  {page}
                </button>
              </li>
            )
          )}

          <li className={`page-item ${!pagination.hasNextPage ? "disabled" : ""}`}>
            <button
              type="button"
              className="page-link"
              disabled={!pagination.hasNextPage}
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

export default RecruiterApplicationsPagination;
