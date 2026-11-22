 

import { useEffect, useRef, useState } from "react";

import {
  uploadMyResume,
    getResumeDownloadUrl,
  downloadMyResumeFile,
  removeMyResume,
} from "../../api/resume.api";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const formatFileSize = (bytes = 0) => {
  if (!bytes) return "0 KB";

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

const getErrorMessage = (error) =>
  error.response?.data?.message ||
  error.message ||
  "Something went wrong. Please try again.";

// Extract the original filename from Content-Disposition.
const getDownloadFilename = (contentDisposition, fallbackName) => {
  if (!contentDisposition) return fallbackName || "resume.pdf";

  // Prefer UTF-8 filename* when available.
  const utf8Match = contentDisposition.match(
    /filename\*=UTF-8''([^;]+)/i
  );

  if (utf8Match?.[1]) {
    try {
      return decodeURIComponent(utf8Match[1]);
    } catch {
      // Fall back to the regular filename.
    }
  }

  const filenameMatch = contentDisposition.match(
    /filename="?([^";]+)"?/i
  );

  return filenameMatch?.[1] || fallbackName || "resume.pdf";
};

function ApplicantResume({ user, profile }) {
  const fileInputRef = useRef(null);

  const [resume, setResume] = useState({
    hasResume: false,
    originalName: "",
    mimeType: "",
    size: 0,
  });

  const [isUploading, setIsUploading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [isViewing, setIsViewing] = useState(false);

  useEffect(() => {
    const updateResume = () => {
      setResume(
        profile?.resume || {
          hasResume: false,
          originalName: "",
          mimeType: "",
          size: 0,
        }
      );
    };

    queueMicrotask(updateResume);
  }, [profile]);

  const handleSelectFile = () => {
    setError("");
    setSuccess("");
    fileInputRef.current?.click();
  };

  const handleUpload = async (event) => {
    const input = event.target;
    const file = input.files?.[0];

    if (!file) return;

    setError("");
    setSuccess("");

    if (file.type !== "application/pdf") {
      setError("Only PDF files are allowed.");
      input.value = "";
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError("Resume file must not exceed 5 MB.");
      input.value = "";
      return;
    }

    setIsUploading(true);

    try {
      const response = await uploadMyResume(file);
      const uploadedResume = response.data.resume;

      setResume({
        hasResume: true,
        ...uploadedResume,
      });

      setSuccess(response.message || "Resume uploaded successfully.");
    } catch (uploadError) {
      setError(getErrorMessage(uploadError));
    } finally {
      setIsUploading(false);
      input.value = "";
    }
  };


//   const handleView = async () => {
//   const applicantId = user?._id || user?.id;

//   if (!applicantId) {
//     setError("Unable to identify your applicant account.");
//     return;
//   }

//   setError("");
//   setSuccess("");

//   const viewWindow = window.open("about:blank", "_blank");

//   if (!viewWindow) {
//     setError("Please allow pop-ups to view your resume.");
//     return;
//   }

//   viewWindow.opener = null;
//   setIsViewing(true);

//   try {
//     const response = await downloadMyResumeFile(
//       applicantId,
//       "inline"
//     );

//     const blob = new Blob([response.data], {
//       type: "application/pdf",
//     });

//     const blobUrl = window.URL.createObjectURL(blob);

//     viewWindow.location.href = blobUrl;

//     window.setTimeout(() => {
//       window.URL.revokeObjectURL(blobUrl);
//     }, 60000);
//   } catch (viewError) {
//     if (!viewWindow.closed) {
//       viewWindow.close();
//     }

//     setError(getErrorMessage(viewError));
//   } finally {
//     setIsViewing(false);
//   }
// };
const handleView = async () => {
  const applicantId = user?._id || user?.id;

  if (!applicantId) {
    setError("Unable to identify your applicant account.");
    return;
  }

  setError("");
  setSuccess("");

  // Open the tab immediately to avoid popup blocking.
  const viewWindow = window.open("about:blank", "_blank");

  if (!viewWindow) {
    setError("Please allow pop-ups to view your resume.");
    return;
  }

  viewWindow.opener = null;
  setIsViewing(true);

  try {
    // Request an authenticated temporary Cloudinary URL.
    const response = await getResumeDownloadUrl(applicantId);

    const viewUrl = response?.data?.viewUrl;

    if (!viewUrl) {
      throw new Error("Unable to generate the resume viewing link.");
    }

    // Open the PDF directly from Cloudinary.
    viewWindow.location.replace(viewUrl);
  } catch (viewError) {
    if (!viewWindow.closed) {
      viewWindow.close();
    }

    setError(getErrorMessage(viewError));
  } finally {
    setIsViewing(false);
  }
};
  const handleDownload = async () => {
    const applicantId = user?._id || user?.id;

    if (!applicantId) {
      setError("Unable to identify your applicant account.");
      return;
    }

    setError("");
    setSuccess("");
    setIsDownloading(true);

    try {
      const response = await downloadMyResumeFile(applicantId);

      const filename = getDownloadFilename(
        response.headers["content-disposition"],
        resume.originalName
      );

      const blob = new Blob([response.data], {
        type: "application/pdf",
      });

      const blobUrl = window.URL.createObjectURL(blob);

      const downloadLink = document.createElement("a");

      downloadLink.href = blobUrl;
      downloadLink.download = filename;

      document.body.appendChild(downloadLink);
      downloadLink.click();
      downloadLink.remove();

      // Release the temporary Blob URL.
      window.URL.revokeObjectURL(blobUrl);

    } catch (downloadError) {
      setError(getErrorMessage(downloadError));
    } finally {
      setIsDownloading(false);
    }
  };

  const handleRemove = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to remove your current resume?"
    );

    if (!confirmed) return;

    setError("");
    setSuccess("");
    setIsRemoving(true);

    try {
      const response = await removeMyResume();

      setResume({
        hasResume: false,
        originalName: "",
        mimeType: "",
        size: 0,
      });

      setSuccess(
        response.data.cleanupPending
          ? "Resume removed. Cloud storage cleanup is pending."
          : response.message || "Resume removed successfully."
      );
    } catch (removeError) {
      setError(getErrorMessage(removeError));
    } finally {
      setIsRemoving(false);
    }
  };

  // const isBusy = isUploading || isDownloading || isRemoving;
const isBusy =
  isUploading || isDownloading || isRemoving || isViewing;
  return (
    <div className="card border-0 shadow-sm mb-4">
      <div className="card-body p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h5 className="mb-1">My Resume</h5>
            <p className="text-muted small mb-0">
              Upload your resume to help recruiters understand your experience.
            </p>
          </div>

          <i className="bi bi-file-earmark-pdf fs-2 text-danger" />
        </div>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        {success && (
          <div className="alert alert-success" role="alert">
            {success}
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,application/pdf"
          className="d-none"
          onChange={handleUpload}
          disabled={isBusy}
        />

        {resume.hasResume ? (
          <div className="border rounded-3 p-3">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
              <div className="d-flex align-items-center gap-3">
                <div className="bg-light rounded-3 p-3">
                  <i className="bi bi-file-earmark-pdf fs-2 text-danger" />
                </div>

                <div className="min-width-0">
                  <h6 className="mb-1 text-break">
                    {resume.originalName || "Uploaded resume"}
                  </h6>

                  <small className="text-muted">
                    {resume.mimeType || "PDF"} ·{" "}
                    {formatFileSize(resume.size)}
                  </small>

                  <div className="mt-1">
                    <span className="badge bg-success-subtle text-success">
                      Resume uploaded
                    </span>
                  </div>
                </div>
              </div>

              <div className="d-flex flex-wrap gap-2">
                {/* <button
                  type="button"
                  className="btn btn-outline-primary btn-sm"
                  onClick={handleDownload}
                  disabled={isBusy}
                >
                  {isDownloading ? (
                    <span className="spinner-border spinner-border-sm me-1" />
                  ) : (
                    <i className="bi bi-download me-1" />
                  )}
                  Download
                </button> */}
                <button
  type="button"
  className="btn btn-outline-primary btn-sm"
  onClick={handleView}
  disabled={isBusy}
>
  {isViewing ? (
    <span className="spinner-border spinner-border-sm me-1" />
  ) : (
    <i className="bi bi-eye me-1" />
  )}
  View
</button>

<button
  type="button"
  className="btn btn-primary btn-sm"
  onClick={handleDownload}
  disabled={isBusy}
>
  {isDownloading ? (
    <span className="spinner-border spinner-border-sm me-1" />
  ) : (
    <i className="bi bi-download me-1" />
  )}
  Download
</button>

                <button
                  type="button"
                  className="btn btn-outline-danger btn-sm"
                  onClick={handleRemove}
                  disabled={isBusy}
                >
                  {isRemoving ? (
                    <span className="spinner-border spinner-border-sm me-1" />
                  ) : (
                    <i className="bi bi-trash me-1" />
                  )}
                  Remove
                </button>
              </div>
            </div>

            <div className="mt-3">
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={handleSelectFile}
                disabled={isBusy}
              >
                <i className="bi bi-arrow-repeat me-2" />
                Replace Resume
              </button>
            </div>
          </div>
        ) : (
          <div className="border border-2 border-dashed rounded-3 p-4 text-center">
            <i className="bi bi-cloud-arrow-up fs-1 text-primary" />

            <h6 className="mt-2">No resume uploaded yet</h6>

            <p className="text-muted small mb-3">
              Upload your resume in PDF format. Maximum file size: 5 MB.
            </p>

            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSelectFile}
              disabled={isBusy}
            >
              {isUploading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" />
                  Uploading...
                </>
              ) : (
                <>
                  <i className="bi bi-upload me-2" />
                  Upload Resume
                </>
              )}
            </button>
          </div>
        )}

        <small className="text-muted d-block mt-3">
          Accepted format: PDF · Maximum size: 5 MB
        </small>
      </div>
    </div>
  );
}

export default ApplicantResume;
