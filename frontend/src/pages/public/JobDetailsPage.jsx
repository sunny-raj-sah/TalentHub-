
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import { applyForJob,  getMyApplications, } from "../../api/applications.api";

import {
  getJobById,
  getSimilarJobs,
    // getMyBookmarks,
//   addBookmark,
//   removeBookmark,
} from "../../api/jobs.api";

import {
  addBookmark,
  removeBookmark,
  getMyBookmarks,
} from "../../api/bookmarks.api";

// import JobCard from "../../components/jobs/JobCard";
import SimilarJobs from "../../components/jobs/SimilarJobs";


const formatLabel = (value = "") =>
  value
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const formatSalary = (salary) => {
  if (!salary) return "Not disclosed";

  const currency = salary.currency || "INR";

  const formatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  });

  return `${formatter.format(salary.min)} - ${formatter.format(
    salary.max
  )}`;
};

const formatExperience = (experience) => {
  if (!experience) return "Not specified";

  return `${experience.min} - ${experience.max} years`;
};

const formatDate = (date) => {
  if (!date) return "Not specified";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};


const getApplicationStatus = (status) => {
  const statusConfig = {
    PENDING: {
      label: "Application under review",
      className: "bg-warning-subtle text-warning-emphasis",
      icon: "bi-hourglass-split",
    },
    SHORTLISTED: {
      label: "You've been shortlisted",
      className: "bg-success-subtle text-success",
      icon: "bi-check-circle",
    },
    REJECTED: {
      label: "Application not selected",
      className: "bg-danger-subtle text-danger",
      icon: "bi-x-circle",
    },
    WITHDRAWN: {
      label: "Application withdrawn",
      className: "bg-secondary-subtle text-secondary",
      icon: "bi-arrow-counterclockwise",
    },
  };

  return (
    statusConfig[status] || {
      label: "Application submitted",
      className: "bg-secondary-subtle text-secondary",
      icon: "bi-info-circle",
    }
  );
};


function JobDetailsContent({ jobId }) {
    const navigate = useNavigate();
const location = useLocation();

const { user, isAuthenticated } = useSelector(
  (state) => state.auth
);

const [currentApplication, setCurrentApplication] = useState(null);
const [isCheckingApplication, setIsCheckingApplication] = useState(false);


// const [isBookmarked, setIsBookmarked] = useState(false);
const [bookmarkedJobIds, setBookmarkedJobIds] = useState([]);
const [isBookmarkLoading, setIsBookmarkLoading] = useState(false);

const [showApplicationForm, setShowApplicationForm] = useState(false);
const [coverLetter, setCoverLetter] = useState("");
const [isApplying, setIsApplying] = useState(false);
const [applicationMessage, setApplicationMessage] = useState("");
const [applicationError, setApplicationError] = useState("");

  const [job, setJob] = useState(null);
  const [recruiterProfile, setRecruiterProfile] = useState(null);
  const [similarJobs, setSimilarJobs] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");


  const isApplicant =
  isAuthenticated && user?.role === "APPLICANT";

const isBookmarked = isApplicant
  ? bookmarkedJobIds.includes(String(jobId))
  : false;

  useEffect(() => {
    let isMounted = true;

    const fetchJobDetails = async () => {
      try {
        const response = await getJobById(jobId);

        if (!isMounted) return;

        const jobData = response.data?.job;
        const profileData = response.data?.recruiterProfile;

        if (!jobData) {
          throw new Error("Job details could not be found.");
        }

        setJob(jobData);
        setRecruiterProfile(profileData || null);
        setIsLoading(false);

        try {
          const similarResponse = await getSimilarJobs(jobId);

          if (isMounted) {
            setSimilarJobs(similarResponse.data?.jobs || []);
          }
        } catch {
          // Similar jobs are optional.
          if (isMounted) {
            setSimilarJobs([]);
          }
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err.response?.data?.message ||
              err.message ||
              "Unable to load job details."
          );
          setIsLoading(false);
        }
      }
    };

    fetchJobDetails();

    return () => {
      isMounted = false;
    };
  }, [jobId]);

 
useEffect(() => {
  if (!isApplicant) return;

  let isMounted = true;

  const fetchBookmarkStatus = async () => {
    try {
      const response = await getMyBookmarks();

      const bookmarks = response.data?.bookmarks || [];

      const bookmarkedIds = bookmarks
        .map((bookmark) => {
          const bookmarkedJob = bookmark.job?._id || bookmark.job;

          return bookmarkedJob ? String(bookmarkedJob) : null;
        })
        .filter(Boolean);

      if (isMounted) {
        setBookmarkedJobIds(bookmarkedIds);
      }
    } catch (error) {
      console.error("Unable to fetch bookmark status:", error);
    }
  };

  fetchBookmarkStatus();

  return () => {
    isMounted = false;
  };
}, [jobId, isApplicant]);

 
useEffect(() => {
  if (!isApplicant) return;

  let isMounted = true;

  const fetchApplicationStatus = async () => {
    try {
      setIsCheckingApplication(true);

      const firstResponse = await getMyApplications();

      const firstData = firstResponse.data;
      const applications = [...(firstData?.applications || [])];

      const totalPages = firstData?.pagination?.totalPages || 1;

      // Fetch remaining pages so older applications are not missed.
      for (let page = 2; page <= totalPages; page += 1) {
        const response = await getMyApplications({ page });

        applications.push(
          ...(response.data?.applications || [])
        );
      }

      const application = applications.find((item) => {
        const appliedJobId = item.job?._id || item.job;

        return String(appliedJobId) === String(jobId);
      });

      if (isMounted) {
        setCurrentApplication(application || null);
      }
    } catch (error) {
      console.error(
        "Unable to check application status:",
        error.response?.data?.message || error.message
      );
    } finally {
      if (isMounted) {
        setIsCheckingApplication(false);
      }
    }
  };

  fetchApplicationStatus();

  return () => {
    isMounted = false;
  };
}, [jobId, isApplicant]);

const handleBookmark = async () => {
  if (!isAuthenticated) {
    navigate("/login", {
      state: { from: location.pathname },
    });
    return;
  }

  if (!isApplicant || isBookmarkLoading) return;

  try {
    setIsBookmarkLoading(true);

    if (isBookmarked) {
      await removeBookmark(jobId);

      setBookmarkedJobIds((previous) =>
        previous.filter((id) => id !== String(jobId))
      );
    } else {
      await addBookmark(jobId);

      setBookmarkedJobIds((previous) =>
        previous.includes(String(jobId))
          ? previous
          : [...previous, String(jobId)]
      );
    }
  } catch (error) {
    console.error(
      "Bookmark action failed:",
      error.response?.data?.message || error.message
    );
  } finally {
    setIsBookmarkLoading(false);
  }
};

const handleApply = async (event) => {
  event.preventDefault();

  if (!isAuthenticated) {
    navigate("/login", {
      state: { from: location.pathname },
    });
    return;
  }

  if (user?.role !== "APPLICANT") {
    return;
  }

  try {
    setIsApplying(true);
    setApplicationError("");
    setApplicationMessage("");

    const response = await applyForJob(jobId, {
      coverLetter: coverLetter.trim(),
    });

    const application = response.data?.application;

    setCurrentApplication(application || {
  status: "PENDING",
});


    setApplicationMessage(
      response.message || "Application submitted successfully."
    );

    setShowApplicationForm(false);
    setCoverLetter("");
  } catch (error) {
    setApplicationError(
      error.response?.data?.message ||
        "Unable to submit your application. Please try again."
    );
  } finally {
    setIsApplying(false);
  }
};


  if (isLoading) {
    return (
      <div className="container py-5">
        <div className="placeholder-glow">
          <div className="placeholder col-3 mb-4" />
          <div className="card border-0 shadow-sm p-4">
            <div className="placeholder col-6 mb-3" />
            <div className="placeholder col-4 mb-4" />
            <div className="placeholder col-12 mb-3" />
            <div className="placeholder col-10 mb-3" />
            <div className="placeholder col-8 mb-3" />
            <div className="placeholder col-12 mb-5" />
            <div className="placeholder col-3" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="container py-5">
        <div className="text-center bg-white rounded-4 shadow-sm p-5">
          <i className="bi bi-exclamation-circle display-4 text-danger" />

          <h3 className="fw-bold mt-3">Job not available</h3>

          <p className="text-secondary">
            {error || "This job may have been removed or archived."}
          </p>

          <Link to="/jobs" className="btn btn-primary mt-2">
            Explore other jobs
          </Link>
        </div>
      </div>
    );
  }

  const recruiterName = job.recruiter?.name || "Hiring Company";

  const companyName =
    recruiterProfile?.companyName || recruiterName;

  const companyInitial = companyName.charAt(0).toUpperCase();

  return (
    <>
      <div className="container py-4 py-lg-5">
        <Link
          to="/jobs"
          className="text-decoration-none text-secondary small"
        >
          <i className="bi bi-arrow-left me-2" />
          Back to jobs
        </Link>

        <div className="row g-4 mt-2">
          <div className="col-lg-8">
            {/* Main job information */}
            <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5">
              <div className="d-flex flex-column flex-md-row justify-content-between gap-3">
                <div className="d-flex gap-3 align-items-start">
                  {recruiterProfile?.companyLogoUrl ? (
                    <img
                      src={recruiterProfile.companyLogoUrl}
                      alt={`${companyName} logo`}
                      className="rounded-3 border"
                      style={{
                        width: "64px",
                        height: "64px",
                        objectFit: "contain",
                      }}
                    />
                  ) : (
                    <div
                      className="rounded-3 bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-content-center fw-bold fs-3"
                      style={{
                        width: "64px",
                        height: "64px",
                        flexShrink: 0,
                      }}
                    >
                      {companyInitial}
                    </div>
                  )}

                  <div>
                    <h2 className="fw-bold mb-1">{job.title}</h2>

                    <p className="text-secondary mb-2">
                      {companyName}
                    </p>

                    <div className="d-flex flex-wrap gap-3 text-secondary small">
                      <span>
                        <i className="bi bi-geo-alt me-1" />
                        {job.location}
                      </span>

                      <span>
                        <i className="bi bi-clock me-1" />
                        {formatLabel(job.employmentType)}
                      </span>
                    </div>
                  </div>
                </div>

                {job.isFeatured && (
                  <span className="badge bg-warning-subtle text-warning-emphasis align-self-start">
                    <i className="bi bi-star-fill me-1" />
                    Featured
                  </span>
                )}
              </div>

              <hr className="my-4" />

              {/* Job overview */}
              <div className="row g-4">
                <div className="col-sm-6">
                  <div className="d-flex gap-3">
                    <i className="bi bi-cash-stack fs-4 text-primary" />
                    <div>
                      <p className="text-secondary small mb-1">
                        Salary range
                      </p>
                      <h6 className="fw-semibold mb-0">
                        {formatSalary(job.salary)}
                      </h6>
                    </div>
                  </div>
                </div>

                <div className="col-sm-6">
                  <div className="d-flex gap-3">
                    <i className="bi bi-briefcase fs-4 text-primary" />
                    <div>
                      <p className="text-secondary small mb-1">
                        Experience
                      </p>
                      <h6 className="fw-semibold mb-0">
                        {formatExperience(job.experience)}
                      </h6>
                    </div>
                  </div>
                </div>

                <div className="col-sm-6">
                  <div className="d-flex gap-3">
                    <i className="bi bi-laptop fs-4 text-primary" />
                    <div>
                      <p className="text-secondary small mb-1">
                        Work mode
                      </p>
                      <h6 className="fw-semibold mb-0">
                        {formatLabel(job.workMode)}
                      </h6>
                    </div>
                  </div>
                </div>

                <div className="col-sm-6">
                  <div className="d-flex gap-3">
                    <i className="bi bi-calendar-event fs-4 text-primary" />
                    <div>
                      <p className="text-secondary small mb-1">
                        Application deadline
                      </p>
                      <h6 className="fw-semibold mb-0">
                        {formatDate(job.applicationDeadline)}
                      </h6>
                    </div>
                  </div>
                </div>
              </div>

          <hr className="my-4" />

<div className="d-flex flex-column flex-sm-row gap-2">
  {user?.role === "APPLICANT" ? (
    <>
      {/* <button
        type="button"
        className="btn btn-primary flex-grow-1"
        onClick={() => {
          setShowApplicationForm((previous) => !previous);
          setApplicationError("");
          setApplicationMessage("");
        }}
      >
        <i className="bi bi-send me-2" />
        Apply for this job
      </button> */}
      {isCheckingApplication ? (
  <button
    type="button"
    className="btn btn-outline-secondary flex-grow-1"
    disabled
  >
    <span className="spinner-border spinner-border-sm me-2" />
    Checking application...
  </button>
) : currentApplication ? (
  <div className="flex-grow-1">
    {(() => {
      const status = getApplicationStatus(
        currentApplication.status
      );

      return (
        <div
          className={`rounded-3 p-3 ${status.className}`}
        >
          <div className="fw-semibold">
            <i className={`bi ${status.icon} me-2`} />
            {status.label}
          </div>

          <small>
            Applied on{" "}
            {formatDate(
              currentApplication.appliedAt ||
                currentApplication.createdAt
            )}
          </small>
        </div>
      );
    })()}
  </div>
) : (
  <button
    type="button"
    className="btn btn-primary flex-grow-1"
    onClick={() => {
      setShowApplicationForm((previous) => !previous);
      setApplicationError("");
      setApplicationMessage("");
    }}
  >
    <i className="bi bi-send me-2" />
    Apply for this job
  </button>
)}

      <button
        type="button"
        className="btn btn-outline-primary"
        onClick={handleBookmark}
        disabled={isBookmarkLoading}
      >
        {isBookmarkLoading ? (
          <span className="spinner-border spinner-border-sm" />
        ) : (
          <i
            className={`bi ${
              isBookmarked ? "bi-bookmark-fill" : "bi-bookmark"
            }`}
          />
        )}

        <span className="ms-2">
          {isBookmarked ? "Saved" : "Save job"}
        </span>
      </button>
    </>
  ) : (
    <button
      type="button"
      className="btn btn-primary flex-grow-1"
      onClick={() => {
        if (!isAuthenticated) {
          navigate("/login", {
            state: { from: location.pathname },
          });
        }
      }}
    >
      {isAuthenticated ? "Applicant account required" : "Login to apply"}
    </button>
  )}
</div>

{showApplicationForm && user?.role === "APPLICANT" && (
  <form onSubmit={handleApply} className="mt-4">
    <label className="form-label fw-semibold">
      Cover letter <span className="text-secondary">(Optional)</span>
    </label>

    <textarea
      className="form-control"
      rows="5"
      maxLength={3000}
      placeholder="Introduce yourself and explain why you're a good fit..."
      value={coverLetter}
      onChange={(event) => setCoverLetter(event.target.value)}
    />

    <div className="text-end text-secondary small mt-1">
      {coverLetter.length}/3000
    </div>

    {applicationError && (
      <div className="alert alert-danger mt-3 mb-0">
        {applicationError}
      </div>
    )}

    <div className="d-flex gap-2 mt-3">
      <button
        type="submit"
        className="btn btn-primary"
        disabled={isApplying}
      >
        {isApplying ? (
          <>
            <span className="spinner-border spinner-border-sm me-2" />
            Submitting...
          </>
        ) : (
          "Submit application"
        )}
      </button>

      <button
        type="button"
        className="btn btn-light"
        onClick={() => setShowApplicationForm(false)}
        disabled={isApplying}
      >
        Cancel
      </button>
    </div>
  </form>
)}

{applicationMessage && (
  <div className="alert alert-success mt-3 mb-0">
    <i className="bi bi-check-circle me-2" />
    {applicationMessage}
  </div>
)}

              {/* Required skills */}
              <section className="mb-4">
                <h5 className="fw-bold mb-3">Required skills</h5>

                <div className="d-flex flex-wrap gap-2">
                  {(job.skills || []).map((skill, index) => (
                    <span
                      key={`${skill}-${index}`}
                      className="badge bg-primary bg-opacity-10 text-primary rounded-pill px-3 py-2 fw-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </section>

              {/* Job description */}
              <section>
                <h5 className="fw-bold mb-3">Job description</h5>

                <div
                  className="text-secondary"
                  style={{ whiteSpace: "pre-line", lineHeight: 1.8 }}
                >
                  {job.description}
                </div>
              </section>
            </div>
          </div>

          {/* Company information */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm rounded-4 p-4">
              <h5 className="fw-bold mb-3">About the company</h5>

              <div className="d-flex align-items-center gap-3 mb-3">
                {recruiterProfile?.companyLogoUrl ? (
                  <img
                    src={recruiterProfile.companyLogoUrl}
                    alt={`${companyName} logo`}
                    className="rounded-3 border"
                    style={{
                      width: "52px",
                      height: "52px",
                      objectFit: "contain",
                    }}
                  />
                ) : (
                  <div
                    className="rounded-3 bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-content-center fw-bold fs-4"
                    style={{ width: "52px", height: "52px" }}
                  >
                    {companyInitial}
                  </div>
                )}

                <div>
                  <h6 className="fw-bold mb-1">{companyName}</h6>
                  <p className="text-secondary small mb-0">
                    {recruiterName}
                  </p>
                </div>
              </div>

              {recruiterProfile?.aboutCompany ? (
                <p className="text-secondary small">
                  {recruiterProfile.aboutCompany}
                </p>
              ) : (
                <p className="text-secondary small">
                  Company information has not been provided yet.
                </p>
              )}

              {recruiterProfile?.website && (
                <a
                  href={recruiterProfile.website}
                  target="_blank"
                  rel="noreferrer"
                  className="text-decoration-none small"
                >
                  <i className="bi bi-globe me-2" />
                  Visit company website
                </a>
              )}
            </div>

            <div className="card border-0 shadow-sm rounded-4 p-4 mt-4">
              <h6 className="fw-bold mb-3">Job information</h6>

              <div className="d-flex justify-content-between mb-3">
                <span className="text-secondary small">Posted on</span>
                <span className="small fw-medium">
                  {formatDate(job.createdAt)}
                </span>
              </div>

              <div className="d-flex justify-content-between">
                <span className="text-secondary small">Deadline</span>
                <span className="small fw-medium">
                  {formatDate(job.applicationDeadline)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Similar jobs */}
        {/* {similarJobs.length > 0 && (
          <section className="mt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
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
              </Link>
            </div>

            <div className="row g-4">
              {similarJobs.map((similarJob) => (
                <div className="col-md-6 col-xl-4" key={similarJob._id}>
                  <JobCard job={similarJob} />
                </div>
              ))}
            </div>
          </section>
        )} */}
        {/* Similar jobs */}
<SimilarJobs jobs={similarJobs} />
      </div>
    </>
  );
}

function JobDetailsPage() {
  const { jobId } = useParams();

  return <JobDetailsContent key={jobId} jobId={jobId} />;
}

export default JobDetailsPage;
