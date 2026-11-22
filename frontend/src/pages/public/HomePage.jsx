 import { useState } from "react";
import { useNavigate } from "react-router-dom";

import FeaturedJobs from "../../components/jobs/FeaturedJobs";
import RecentJobs from "../../components/jobs/RecentJobs";

function HomePage() {
  const navigate = useNavigate();

  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");

  const handleSearch = (event) => {
    event.preventDefault();

    const searchParams = new URLSearchParams();

    if (keyword.trim()) {
    //   searchParams.set("keyword", keyword.trim());
    searchParams.set("search", keyword.trim());
    }

    if (location.trim()) {
      searchParams.set("location", location.trim());
    }

    navigate(`/jobs?${searchParams.toString()}`);
  };

  return (
    <>
      {/* Hero section */}
      <section className="py-5">
        <div className="container py-lg-5">
          <div className="row justify-content-center text-center">
            <div className="col-lg-9 col-xl-8">
              <span className="badge rounded-pill bg-primary-subtle text-primary px-3 py-2 mb-4">
                <i className="bi bi-stars me-2" />
                Your next opportunity starts here
              </span>

              <h1
                className="display-4 fw-bold mb-4"
                style={{
                  color: "var(--th-heading)",
                  lineHeight: 1.2,
                  letterSpacing: "-1.5px",
                }}
              >
                Find the job that
                <span className="text-primary">
                  {" "}moves you forward.
                </span>
              </h1>

              <p className="fs-5 text-secondary mb-5 mx-auto">
                Discover opportunities that match your skills, grow your
                career, and connect with companies looking for talent like you.
              </p>

              {/* Search form */}
              <form
                onSubmit={handleSearch}
                className="bg-white rounded-4 shadow-sm border p-2"
              >
                <div className="row g-2 align-items-center">
                  <div className="col-lg">
                    <div className="d-flex align-items-center px-3">
                      <i className="bi bi-search text-secondary fs-5 me-3" />

                      <input
                        type="text"
                        className="form-control border-0 shadow-none"
                        placeholder="Job title, skill or keyword"
                        value={keyword}
                        onChange={(event) => setKeyword(event.target.value)}
                        aria-label="Job title, skill or keyword"
                      />
                    </div>
                  </div>

                  <div className="col-lg-auto d-none d-lg-block">
                    <div
                      className="vr"
                      style={{
                        height: "35px",
                        color: "var(--th-border)",
                      }}
                    />
                  </div>

                  <div className="col-lg">
                    <div className="d-flex align-items-center px-3">
                      <i className="bi bi-geo-alt text-secondary fs-5 me-3" />

                      <input
                        type="text"
                        className="form-control border-0 shadow-none"
                        placeholder="City or location"
                        value={location}
                        onChange={(event) => setLocation(event.target.value)}
                        aria-label="Job location"
                      />
                    </div>
                  </div>

                  <div className="col-lg-auto">
                    <button
                      type="submit"
                      className="btn btn-primary fw-semibold px-4 py-3 w-100"
                    >
                      Search Jobs
                      <i className="bi bi-arrow-right ms-2" />
                    </button>
                  </div>
                </div>
              </form>

              <p className="small text-secondary mt-3 mb-0">
                <i className="bi bi-lightbulb me-1" />
                Explore opportunities across different roles and industries.
              </p>
            </div>
          </div>

          {/* Platform highlights */}
          <div className="row justify-content-center g-4 mt-5 pt-4">
            <div className="col-6 col-md-4">
              <div className="text-center">
                <h3 className="fw-bold mb-1">Discover</h3>
                <p className="small text-secondary mb-0">
                  Relevant job opportunities
                </p>
              </div>
            </div>

            <div className="col-6 col-md-4">
              <div className="text-center">
                <h3 className="fw-bold mb-1">Connect</h3>
                <p className="small text-secondary mb-0">
                  With growing companies
                </p>
              </div>
            </div>

            <div className="col-12 col-md-4">
              <div className="text-center">
                <h3 className="fw-bold mb-1">Grow</h3>
                <p className="small text-secondary mb-0">
                  Build your career with confidence
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured opportunities */}
      <FeaturedJobs />

      {/* Latest opportunities */}
      <RecentJobs />
    </>
  );
}

export default HomePage;