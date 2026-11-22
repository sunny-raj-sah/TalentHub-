import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { fetchRecentJobsThunk } from "../../features/jobs/jobsThunks";
import JobCard from "./JobCard";

function RecentJobs() {
  const dispatch = useDispatch();

  const {
    recentJobs,
    isRecentLoading,
    recentError,
      hasFetchedRecent,
  } = useSelector((state) => state.jobs);

//   useEffect(() => {
//     if (
//       recentJobs.length === 0 &&
//       !isRecentLoading &&
//       !recentError
//     ) {
//       dispatch(fetchRecentJobsThunk());
//     }
//   }, [
//     dispatch,
//     recentJobs.length,
//     isRecentLoading,
//     recentError,
//   ]);
useEffect(() => {
  if (
    !hasFetchedRecent &&
    !isRecentLoading &&
    !recentError
  ) {
    dispatch(fetchRecentJobsThunk());
  }
}, [
  dispatch,
  hasFetchedRecent,
  isRecentLoading,
  recentError,
]);
  return (
    <section className="py-5 bg-white">
      <div className="container py-lg-4">
        {/* Section heading */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end gap-3 mb-4">
          <div>
            <span className="text-primary fw-semibold small text-uppercase">
              Fresh opportunities
            </span>

            <h2 className="fw-bold mt-2 mb-2">
              Recently Posted Jobs
            </h2>

            <p className="text-secondary mb-0">
              Stay updated with the latest opportunities from recruiters.
            </p>
          </div>

          <Link
            to="/jobs"
            className="btn btn-outline-primary fw-semibold align-self-start align-self-md-auto"
          >
            View All Jobs
            <i className="bi bi-arrow-right ms-2" />
          </Link>
        </div>

        {/* Loading state */}
        {isRecentLoading && (
          <div className="row g-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div className="col-md-6 col-lg-4" key={index}>
                <div className="card border rounded-4 h-100">
                  <div className="card-body p-4">
                    <div className="placeholder-glow">
                      <span className="placeholder col-4 mb-3" />
                      <span className="placeholder col-8 mb-3" />
                      <span className="placeholder col-6 mb-4" />
                      <span className="placeholder col-10 mb-2" />
                      <span className="placeholder col-7" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error state */}
        {!isRecentLoading && recentError && (
          <div className="text-center border rounded-4 p-5">
            <i className="bi bi-exclamation-circle text-danger fs-1" />

            <h5 className="fw-bold mt-3">
              Couldn't load recent jobs
            </h5>

            <p className="text-secondary">
              {recentError}
            </p>

            <button
              type="button"
              className="btn btn-primary"
              onClick={() => dispatch(fetchRecentJobsThunk())}
            >
              <i className="bi bi-arrow-clockwise me-2" />
              Try Again
            </button>
          </div>
        )}

        {/* Empty state */}
        {!isRecentLoading &&
          !recentError &&
          recentJobs.length === 0 && (
            <div className="text-center border rounded-4 p-5">
              <i className="bi bi-calendar2-event text-secondary fs-1" />

              <h5 className="fw-bold mt-3">
                No recent jobs available
              </h5>

              <p className="text-secondary mb-0">
                New opportunities will appear here when recruiters post them.
              </p>
            </div>
          )}

        {/* Job cards */}
        {!isRecentLoading &&
          !recentError &&
          recentJobs.length > 0 && (
            <div className="row g-4">
              {recentJobs.map((job) => (
                <div className="col-md-6 col-lg-4" key={job._id}>
                  <JobCard job={job} />
                </div>
              ))}
            </div>
          )}
      </div>
    </section>
  );
}

export default RecentJobs;