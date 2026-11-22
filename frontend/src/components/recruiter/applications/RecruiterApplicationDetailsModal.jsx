import { useState } from "react";
import { getApplicationResumeDownloadUrl } from "../../../api/resume.api";


const formatDate = (date) => {
  if (!date) return "Not provided";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const formatEmploymentType = (value) =>
  value?.replaceAll("_", " ") || "Not specified";

function RecruiterApplicationDetailsModal({
  details,
  isLoading,
  error,
  onClose,
  onRetry,
}) {
  const [resumeAction, setResumeAction] = useState("");
const [resumeError, setResumeError] = useState("");

  const application = details?.application;
  const profile = details?.applicantProfile;
  const applicant = application?.applicant || {};
  const job = application?.job || {};

  const handleResumeAction = async (action) => {
  if (!application?._id || resumeAction) return;

  setResumeError("");
  setResumeAction(action);

  // Open a blank tab immediately to avoid browser popup blocking.
  let viewWindow = null;

  if (action === "view") {
    viewWindow = window.open("about:blank", "_blank");

    if (!viewWindow) {
      setResumeError(
        "Please allow pop-ups to view the applicant's resume."
      );
      setResumeAction("");
      return;
    }

    viewWindow.opener = null;
  }

  try {
    const response = await getApplicationResumeDownloadUrl(
      application._id
    );

    const resumeData = response?.data;

    const resumeUrl =
      action === "view"
        ? resumeData?.viewUrl
        : resumeData?.downloadUrl;

    if (!resumeUrl) {
      throw new Error("Unable to generate the resume link.");
    }

    if (action === "view") {
      viewWindow.location.href = resumeUrl;
    } else {
      const downloadLink = document.createElement("a");

      downloadLink.href = resumeUrl;
      downloadLink.download =
        application.resumeOriginalName || "resume.pdf";

      document.body.appendChild(downloadLink);
      downloadLink.click();
      downloadLink.remove();
    }
  } catch (error) {
    if (viewWindow && !viewWindow.closed) {
      viewWindow.close();
    }

    setResumeError(
      error.response?.data?.message ||
        error.message ||
        "Unable to access the applicant's resume. Please try again."
    );
  } finally {
    setResumeAction("");
  }
};

  const statusStyles = {
    PENDING: "bg-warning-subtle text-warning-emphasis",
    SHORTLISTED: "bg-success-subtle text-success-emphasis",
    REJECTED: "bg-danger-subtle text-danger-emphasis",
    WITHDRAWN: "bg-secondary-subtle text-secondary-emphasis",
  };

  const hasProfileContent =
    profile?.bio ||
    profile?.skills?.length ||
    profile?.experience?.length ||
    profile?.education?.length;

  return (
    <div
      className="modal d-block"
      tabIndex="-1"
      role="dialog"
      aria-modal="true"
      aria-labelledby="applicationDetailsTitle"
      style={{ backgroundColor: "rgba(0,0,0,0.55)", zIndex: 1055 }}
    >
      <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
        <div className="modal-content border-0 shadow">
          <div className="modal-header">
            <div>
              <h5
                className="modal-title fw-bold"
                id="applicationDetailsTitle"
              >
                Applicant Details
              </h5>
              <small className="text-muted">
                Review the applicant's profile and application
              </small>
            </div>

            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={onClose}
            />
          </div>

          <div className="modal-body p-3 p-md-4">
            {isLoading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">
                    Loading applicant details...
                  </span>
                </div>
                <p className="text-muted mt-3 mb-0">
                  Loading applicant details...
                </p>
              </div>
            ) : error ? (
              <div className="alert alert-danger mb-0">
                <p className="mb-3">{error}</p>
                <button
                  type="button"
                  className="btn btn-outline-danger btn-sm"
                  onClick={onRetry}
                >
                  <i className="bi bi-arrow-clockwise me-1" />
                  Try Again
                </button>
              </div>
            ) : application ? (
              <>
                {/* Applicant profile header */}
                <div className="d-flex flex-column flex-sm-row align-items-center align-items-sm-start gap-3 mb-4">
                  {profile?.photoUrl ? (
                    <img
                      src={profile.photoUrl}
                      alt={applicant.name || "Applicant"}
                      className="rounded-circle border"
                      style={{
                        width: 88,
                        height: 88,
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <div
                      className="rounded-circle bg-primary-subtle text-primary d-flex align-items-center justify-content-center fw-bold fs-2"
                      style={{ width: 88, height: 88, flexShrink: 0 }}
                    >
                      {applicant.name?.charAt(0)?.toUpperCase() || "A"}
                    </div>
                  )}

                  <div className="text-center text-sm-start">
                    <h4 className="fw-bold mb-1">
                      {applicant.name || "Applicant"}
                    </h4>
                    <p className="text-muted mb-2">
                      <i className="bi bi-envelope me-2" />
                      {applicant.email || "Email unavailable"}
                    </p>

                    <span
                      className={`badge rounded-pill px-3 py-2 ${
                        statusStyles[application.status] ||
                        "bg-secondary-subtle text-secondary"
                      }`}
                    >
                      {application.status?.replaceAll("_", " ") || "Unknown"}
                    </span>
                  </div>
                </div>

                {/* Application information */}
                <section className="mb-4">
                  <h6 className="fw-bold mb-3">
                    <i className="bi bi-briefcase me-2 text-primary" />
                    Application Information
                  </h6>

                  <div className="bg-light rounded-3 p-3">
                    <h6 className="mb-2">
                      {job.title || "Job title unavailable"}
                    </h6>

                    <p className="text-muted small mb-2">
                      <i className="bi bi-geo-alt me-1" />
                      {job.location || "Location unavailable"}
                      {" · "}
                      {formatEmploymentType(job.employmentType)}
                      {" · "}
                      {formatEmploymentType(job.workMode)}
                    </p>

                    <small className="text-muted">
                      <i className="bi bi-calendar3 me-2" />
                      Applied on {formatDate(application.appliedAt)}
                    </small>
                  </div>

                  <div className="mt-3">
                    <h6 className="fw-semibold">Cover Letter</h6>
                    {application.coverLetter ? (
                      <p
                        className="text-muted mb-0"
                        style={{ whiteSpace: "pre-wrap" }}
                      >
                        {application.coverLetter}
                      </p>
                    ) : (
                      <p className="text-muted small mb-0">
                        No cover letter provided.
                      </p>
                    )}
                  </div>
                </section>

                {/* Applicant bio */}
                <section className="mb-4">
                  <h6 className="fw-bold mb-3">
                    <i className="bi bi-person me-2 text-primary" />
                    About Applicant
                  </h6>

                  <p className="text-muted mb-0">
                    {profile?.bio || "The applicant has not added a bio."}
                  </p>
                </section>

                {/* Skills */}
                <section className="mb-4">
                  <h6 className="fw-bold mb-3">
                    <i className="bi bi-tools me-2 text-primary" />
                    Skills
                  </h6>

                  {profile?.skills?.length ? (
                    <div className="d-flex flex-wrap gap-2">
                      {profile.skills.map((skill, index) => (
                        <span
                          key={`${skill}-${index}`}
                          className="badge bg-primary-subtle text-primary px-3 py-2"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted small mb-0">
                      No skills added yet.
                    </p>
                  )}
                </section>

                {/* Experience */}
                <section className="mb-4">
                  <h6 className="fw-bold mb-3">
                    <i className="bi bi-building me-2 text-primary" />
                    Work Experience
                  </h6>

                  {profile?.experience?.length ? (
                    <div className="d-flex flex-column gap-3">
                      {profile.experience.map((item, index) => (
                        <div
                          key={item._id || index}
                          className="border-start border-3 ps-3"
                        >
                          <h6 className="mb-1">
                            {item.jobTitle || "Position not specified"}
                          </h6>

                          <p className="text-muted small mb-1">
                            {item.company || "Company not specified"}
                            {item.location ? ` · ${item.location}` : ""}
                          </p>

                          <small className="text-muted">
                            {item.startDate
                              ? formatDate(item.startDate)
                              : "Start date unavailable"}
                            {" – "}
                            {item.currentlyWorking
                              ? "Present"
                              : formatDate(item.endDate)}
                          </small>

                          {item.description && (
                            <p
                              className="text-muted small mt-2 mb-0"
                              style={{ whiteSpace: "pre-wrap" }}
                            >
                              {item.description}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted small mb-0">
                      No work experience added yet.
                    </p>
                  )}
                </section>

                {/* Education */}
                <section className="mb-4">
                  <h6 className="fw-bold mb-3">
                    <i className="bi bi-mortarboard me-2 text-primary" />
                    Education
                  </h6>

                  {profile?.education?.length ? (
                    <div className="d-flex flex-column gap-3">
                      {profile.education.map((item, index) => (
                        <div
                          key={item._id || index}
                          className="border-start border-3 ps-3"
                        >
                          <h6 className="mb-1">
                            {item.institution || "Institution not specified"}
                          </h6>

                          <p className="text-muted small mb-1">
                            {[item.degree, item.fieldOfStudy]
                              .filter(Boolean)
                              .join(" · ") || "Degree not specified"}
                          </p>

                          <small className="text-muted">
                            {item.startYear || "—"}
                            {" – "}
                            {item.endYear || "Present"}
                          </small>

                          {item.description && (
                            <p className="text-muted small mt-2 mb-0">
                              {item.description}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted small mb-0">
                      No education details added yet.
                    </p>
                  )}
                </section>

                {!hasProfileContent && (
                  <div className="alert alert-light border small mb-0">
                    The applicant has not completed their profile yet.
                  </div>
                )}

                {/* Resume metadata */}
                {/* <section>
                  <h6 className="fw-bold mb-3">
                    <i className="bi bi-file-earmark-pdf me-2 text-primary" />
                    Submitted Resume
                  </h6>

                  {application.resumeOriginalName ? (
                    <div className="d-flex align-items-center gap-3 bg-light rounded-3 p-3">
                      <i className="bi bi-file-earmark-pdf fs-2 text-danger" />
                      <div className="min-w-0">
                        <p className="fw-semibold text-break mb-1">
                          {application.resumeOriginalName}
                        </p>
                        <small className="text-muted">
                          {application.resumeSize
                            ? `${(application.resumeSize / 1024 / 1024).toFixed(2)} MB`
                            : "File size unavailable"}
                        </small>
                      </div>
                    </div>
                  ) : (
                    <p className="text-muted small mb-0">
                      No resume was attached to this application.
                    </p>
                  )}
                </section> */}
                {/* Submitted Resume */}
<section>
  <h6 className="fw-bold mb-3">
    <i className="bi bi-file-earmark-pdf me-2 text-primary" />
    Submitted Resume
  </h6>

  {application.resumeOriginalName ? (
    <div className="bg-light rounded-3 p-3">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
        <div className="d-flex align-items-center gap-3 min-w-0">
          <i className="bi bi-file-earmark-pdf fs-2 text-danger" />

          <div className="min-w-0">
            <p className="fw-semibold text-break mb-1">
              {application.resumeOriginalName}
            </p>

            <small className="text-muted">
              {application.resumeSize
                ? `${(application.resumeSize / 1024 / 1024).toFixed(2)} MB`
                : "File size unavailable"}
            </small>
          </div>
        </div>

        <div className="d-flex flex-wrap gap-2">
          <button
            type="button"
            className="btn btn-outline-primary btn-sm"
            onClick={() => handleResumeAction("view")}
            disabled={Boolean(resumeAction)}
          >
            {resumeAction === "view" ? (
              <span className="spinner-border spinner-border-sm me-1" />
            ) : (
              <i className="bi bi-eye me-1" />
            )}
            View Resume
          </button>

          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => handleResumeAction("download")}
            disabled={Boolean(resumeAction)}
          >
            {resumeAction === "download" ? (
              <span className="spinner-border spinner-border-sm me-1" />
            ) : (
              <i className="bi bi-download me-1" />
            )}
            Download
          </button>
        </div>
      </div>

      {resumeError && (
        <div className="alert alert-danger small mt-3 mb-0">
          {resumeError}
        </div>
      )}
    </div>
  ) : (
    <p className="text-muted small mb-0">
      No resume was attached to this application.
    </p>
  )}
</section>
              </>
            ) : (
              <div className="text-center text-muted py-5">
                Application details are unavailable.
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecruiterApplicationDetailsModal;
