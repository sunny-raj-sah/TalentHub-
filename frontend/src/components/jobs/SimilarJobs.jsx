
import { Link } from "react-router-dom";
import JobCard from "./JobCard";

function SimilarJobs({ jobs = [] }) {
  if (!jobs.length) return null;

  return (
    <section className="mt-5">
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
        <div>
          <h3 className="fw-bold mb-1">Similar opportunities</h3>

          <p className="text-secondary mb-0">
            Jobs that match this role's skills and requirements.
          </p>
        </div>

        <Link
          to="/jobs"
          className="text-decoration-none fw-semibold"
        >
          View all jobs
          <i className="bi bi-arrow-right ms-2" />
        </Link>
      </div>

      <div className="row g-4">
        {jobs.map((job) => (
          <div className="col-md-6 col-xl-4" key={job._id}>
            <JobCard job={job} />
          </div>
        ))}
      </div>
    </section>
  );
}

export default SimilarJobs;
