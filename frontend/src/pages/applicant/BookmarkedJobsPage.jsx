
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import {
  fetchMyBookmarksThunk,
  removeBookmarkThunk,
} from "../../features/bookmarks/bookmarksThunks";

import {
  clearBookmarkFeedback,
} from "../../features/bookmarks/bookmarksSlice";

import SavedJobCard from "../../components/applicant/SavedJobCard";
import SavedJobsEmptyState from "../../components/applicant/SavedJobsEmptyState";

function BookmarkedJobsPage() {
  const dispatch = useDispatch();

  const [currentPage, setCurrentPage] = useState(1);

  const {
    bookmarks,
    pagination,
    isLoading,
    removingJobIds,
    error,
    removeError,
  } = useSelector((state) => state.bookmarks);

  useEffect(() => {
    dispatch(
      fetchMyBookmarksThunk({
        page: currentPage,
        limit: 8,
      })
    );
  }, [dispatch, currentPage]);

  useEffect(() => {
    return () => {
      dispatch(clearBookmarkFeedback());
    };
  }, [dispatch]);

  const handleRemoveBookmark = (jobId) => {
    dispatch(removeBookmarkThunk(jobId));
  };

  const handlePreviousPage = () => {
    setCurrentPage((previous) => Math.max(1, previous - 1));
  };

  const handleNextPage = () => {
    if (pagination?.hasNextPage) {
      setCurrentPage((previous) => previous + 1);
    }
  };

  const handleRetry = () => {
    dispatch(
      fetchMyBookmarksThunk({
        page: currentPage,
        limit: 8,
      })
    );
  };

  return (
    <main className="container py-4 py-lg-5">
      {/* Page heading */}
      <div className="mb-4">
        <Link
          to="/applicant/dashboard"
          className="text-decoration-none small text-secondary"
        >
          <i className="bi bi-arrow-left me-2" />
          Back to Dashboard
        </Link>

        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mt-3">
          <div>
            <h2 className="fw-bold mb-2">
              Saved Jobs
            </h2>

            <p className="text-secondary mb-0">
              Keep track of opportunities you're interested in.
            </p>
          </div>

          <Link to="/jobs" className="btn btn-primary">
            <i className="bi bi-search me-2" />
            Explore More Jobs
          </Link>
        </div>
      </div>

      {/* Bookmark count */}
      {!error && (
        <div className="mb-4">
          <span className="text-secondary small">
            {pagination?.totalBookmarks ?? bookmarks.length} saved jobs
          </span>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="alert alert-danger d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
          <span>{error}</span>

          <button
            type="button"
            className="btn btn-outline-danger btn-sm"
            onClick={handleRetry}
          >
            Try Again
          </button>
        </div>
      )}

      {removeError && (
        <div className="alert alert-danger alert-dismissible">
          {removeError}

          <button
            type="button"
            className="btn-close"
            aria-label="Close"
            onClick={() => dispatch(clearBookmarkFeedback())}
          />
        </div>
      )}

      {/* Loading */}
      {isLoading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">
              Loading saved jobs...
            </span>
          </div>

          <p className="text-secondary mt-3 mb-0">
            Loading your saved jobs...
          </p>
        </div>
      ) : !error && bookmarks.length === 0 ? (
        <div className="card border-0 shadow-sm">
          <div className="card-body">
            <SavedJobsEmptyState />
          </div>
        </div>
      ) : !error ? (
        <>
          {/* Saved jobs */}
          <div className="row g-4">
            {bookmarks.map((bookmark) => (
              <div
                className="col-12 col-lg-6"
                key={bookmark._id}
              >
                <SavedJobCard
                  bookmark={bookmark}
                  onRemove={handleRemoveBookmark}
                  isRemoving={removingJobIds.includes(
                    bookmark.job?._id
                  )}
                />
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination?.totalPages > 1 && (
            <div className="d-flex justify-content-between align-items-center mt-4">
              <button
                type="button"
                className="btn btn-outline-primary"
                onClick={handlePreviousPage}
                disabled={!pagination.hasPreviousPage || isLoading}
              >
                <i className="bi bi-arrow-left me-2" />
                Previous
              </button>

              <span className="text-secondary small">
                Page {pagination.currentPage} of{" "}
                {pagination.totalPages}
              </span>

              <button
                type="button"
                className="btn btn-outline-primary"
                onClick={handleNextPage}
                disabled={!pagination.hasNextPage || isLoading}
              >
                Next
                <i className="bi bi-arrow-right ms-2" />
              </button>
            </div>
          )}
        </>
      ) : null}
    </main>
  );
}

export default BookmarkedJobsPage;
