import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { fetchFeaturedJobsThunk } from "../../features/jobs/jobsThunks";
import JobCard from "./JobCard";

function FeaturedJobs() {
  const dispatch = useDispatch();

  const {
    featuredJobs,
    isFeaturedLoading,
    featuredError,
      hasFetchedFeatured,
  } = useSelector((state) => state.jobs);

 
//     if (featuredJobs.length === 0 && !isFeaturedLoading) {
//       dispatch(fetchFeaturedJobsThunk());
//     }
//   }, [dispatch, featuredJobs.length, isFeaturedLoading]);
 
useEffect(() => {
  if (
    !hasFetchedFeatured &&
    !isFeaturedLoading &&
    !featuredError
  ) {
    dispatch(fetchFeaturedJobsThunk());
  }
}, [
  dispatch,
  hasFetchedFeatured,
  isFeaturedLoading,
  featuredError,
]);
  return (
    <section className="py-5">
      <div className="container py-lg-4">
        {/* Section heading */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end gap-3 mb-4">
          <div>
            <span className="text-primary fw-semibold small text-uppercase">
              Handpicked opportunities
            </span>

            <h2 className="fw-bold mt-2 mb-2">
              Featured Jobs
            </h2>

            <p className="text-secondary mb-0">
              Explore opportunities worth taking a closer look at.
            </p>
          </div>

          <Link
            to="/jobs"
            className="btn btn-outline-primary fw-semibold align-self-start align-self-md-auto"
          >
            Explore All Jobs
            <i className="bi bi-arrow-right ms-2" />
          </Link>
        </div>

        {/* Loading state */}
        {isFeaturedLoading && (
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
        {!isFeaturedLoading && featuredError && (
          <div className="text-center bg-white border rounded-4 p-5">
            <i className="bi bi-exclamation-circle text-danger fs-1" />

            <h5 className="fw-bold mt-3">
              Couldn't load featured jobs
            </h5>

            <p className="text-secondary">
              {featuredError}
            </p>

            <button
              type="button"
              className="btn btn-primary"
              onClick={() => dispatch(fetchFeaturedJobsThunk())}
            >
              <i className="bi bi-arrow-clockwise me-2" />
              Try Again
            </button>
          </div>
        )}

        {/* Empty state */}
        {!isFeaturedLoading &&
          !featuredError &&
          featuredJobs.length === 0 && (
            <div className="text-center bg-white border rounded-4 p-5">
              <i className="bi bi-briefcase text-secondary fs-1" />

              <h5 className="fw-bold mt-3">
                No featured jobs right now
              </h5>

              <p className="text-secondary mb-0">
                Check back soon for new opportunities.
              </p>
            </div>
          )}

        {/* Job cards */}
        {!isFeaturedLoading &&
          !featuredError &&
          featuredJobs.length > 0 && (
            <div className="row g-4">
              {featuredJobs.map((job) => (
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

export default FeaturedJobs;