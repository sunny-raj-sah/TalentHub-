 
// // import { useState } from "react";

// // import { getApplicationResumeDownloadUrl } from "../../api/resume.api";

// // const formatFileSize = (bytes) => {
// //   if (!bytes) return "Size unavailable";

// //   const sizeInKB = bytes / 1024;

// //   if (sizeInKB >= 1024) {
// //     return `${(sizeInKB / 1024).toFixed(2)} MB`;
// //   }

// //   return `${sizeInKB.toFixed(2)} KB`;
// // };

// // const formatFileType = (mimeType) => {
// //   if (mimeType === "application/pdf") {
// //     return "PDF Document";
// //   }

// //   return mimeType || "File type unavailable";
// // };

// // const ApplicationResumeCard = ({ application }) => {
// //   const [isDownloading, setIsDownloading] = useState(false);
// //   const [downloadError, setDownloadError] = useState("");

// //   const hasResume = Boolean(application?.resumeOriginalName);

// //   const handleDownload = async () => {
// //     try {
// //       setIsDownloading(true);
// //       setDownloadError("");

// //       const response = await getApplicationResumeDownloadUrl(
// //         application._id
// //       );

// //       const downloadUrl = response?.data?.downloadUrl;

// //       if (!downloadUrl) {
// //         throw new Error("Download link could not be generated.");
// //       }

// //       // Open the temporary Cloudinary download URL.
// //       const link = document.createElement("a");
// //       link.href = downloadUrl;
// //       link.target = "_blank";
// //       link.rel = "noopener noreferrer";
// //       link.click();
// //     } catch (error) {
// //       setDownloadError(
// //         error.response?.data?.message ||
// //           error.message ||
// //           "Unable to download the resume. Please try again."
// //       );
// //     } finally {
// //       setIsDownloading(false);
// //     }
// //   };

// //   return (
// //     <div className="card border-0 shadow-sm h-100">
// //       <div className="card-body p-4">
// //         <div className="d-flex align-items-center gap-2 mb-3">
// //           <i className="bi bi-file-earmark-pdf text-primary fs-4" />
// //           <h5 className="mb-0 fw-semibold">Submitted Resume</h5>
// //         </div>

// //         {hasResume ? (
// //           <>
// //             <div className="d-flex align-items-center gap-3 p-3 bg-light rounded-3 mb-3">
// //               <i className="bi bi-file-earmark-pdf text-danger fs-2" />

// //               <div className="flex-grow-1 min-w-0">
// //                 <p className="fw-semibold text-break mb-1">
// //                   {application.resumeOriginalName}
// //                 </p>

// //                 <small className="text-muted">
// //                   {formatFileType(application.resumeMimeType)}
// //                   {" · "}
// //                   {formatFileSize(application.resumeSize)}
// //                 </small>
// //               </div>
// //             </div>

// //             <button
// //               type="button"
// //               className="btn btn-primary w-100"
// //               onClick={handleDownload}
// //               disabled={isDownloading}
// //             >
// //               {isDownloading ? (
// //                 <>
// //                   <span
// //                     className="spinner-border spinner-border-sm me-2"
// //                     role="status"
// //                     aria-hidden="true"
// //                   />
// //                   Generating download link...
// //                 </>
// //               ) : (
// //                 <>
// //                   <i className="bi bi-download me-2" />
// //                   Download Resume
// //                 </>
// //               )}
// //             </button>

// //             {downloadError && (
// //               <div className="alert alert-danger mt-3 mb-0" role="alert">
// //                 {downloadError}
// //               </div>
// //             )}

// //             <small className="text-muted d-block mt-2">
// //               This is the resume attached when you submitted this
// //               application.
// //             </small>
// //           </>
// //         ) : (
// //           <div className="text-center py-4">
// //             <i className="bi bi-file-earmark-x text-muted fs-1" />
// //             <p className="text-muted mb-0 mt-2">
// //               No resume was attached to this application.
// //             </p>
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   );
// // };

// // export default ApplicationResumeCard;

// // ------------------------------------------------------------------


// import { useState } from "react";

// import { getApplicationResumeDownloadUrl } from "../../api/resume.api";

// const formatFileSize = (bytes) => {
//   if (!bytes) return "Size unavailable";

//   const sizeInKB = bytes / 1024;

//   if (sizeInKB >= 1024) {
//     return `${(sizeInKB / 1024).toFixed(2)} MB`;
//   }

//   return `${sizeInKB.toFixed(2)} KB`;
// };

// const formatFileType = (mimeType) => {
//   if (mimeType === "application/pdf") {
//     return "PDF Document";
//   }

//   return mimeType || "File type unavailable";
// };

// const ApplicationResumeCard = ({ application }) => {
//   const [resumeAction, setResumeAction] = useState("");
//   const [resumeError, setResumeError] = useState("");

//   const hasResume = Boolean(application?.resumeOriginalName);

//   const handleResumeAction = async (action) => {
//     if (!application?._id || resumeAction) return;

//     setResumeError("");
//     setResumeAction(action);

//     // Open a blank tab immediately to avoid popup blocking.
//     let viewWindow = null;

//     if (action === "view") {
//       viewWindow = window.open("about:blank", "_blank");

//       if (!viewWindow) {
//         setResumeError(
//           "Please allow pop-ups to view your submitted resume."
//         );
//         setResumeAction("");
//         return;
//       }

//       viewWindow.opener = null;
//     }

//     try {
//       const response = await getApplicationResumeDownloadUrl(
//         application._id
//       );

//       const resumeData = response?.data;

//       const resumeUrl =
//         action === "view"
//           ? resumeData?.viewUrl
//           : resumeData?.downloadUrl;

//       if (!resumeUrl) {
//         throw new Error("Unable to generate the resume link.");
//       }

//       if (action === "view") {
//         viewWindow.location.href = resumeUrl;
//       } else {
//         const downloadLink = document.createElement("a");

//         downloadLink.href = resumeUrl;
//         downloadLink.download =
//           application.resumeOriginalName || "resume.pdf";

//         document.body.appendChild(downloadLink);
//         downloadLink.click();
//         downloadLink.remove();
//       }
//     } catch (error) {
//       if (viewWindow && !viewWindow.closed) {
//         viewWindow.close();
//       }

//       setResumeError(
//         error.response?.data?.message ||
//           error.message ||
//           "Unable to access the resume. Please try again."
//       );
//     } finally {
//       setResumeAction("");
//     }
//   };

//   return (
//     <div className="card border-0 shadow-sm h-100">
//       <div className="card-body p-4">
//         <div className="d-flex align-items-center gap-2 mb-3">
//           <i className="bi bi-file-earmark-pdf text-primary fs-4" />
//           <h5 className="mb-0 fw-semibold">Submitted Resume</h5>
//         </div>

//         {hasResume ? (
//           <>
//             <div className="d-flex align-items-center gap-3 p-3 bg-light rounded-3 mb-3">
//               <i className="bi bi-file-earmark-pdf text-danger fs-2" />

//               <div className="flex-grow-1 min-w-0">
//                 <p className="fw-semibold text-break mb-1">
//                   {application.resumeOriginalName}
//                 </p>

//                 <small className="text-muted">
//                   {formatFileType(application.resumeMimeType)}
//                   {" · "}
//                   {formatFileSize(application.resumeSize)}
//                 </small>
//               </div>
//             </div>

//             <div className="d-flex flex-column flex-sm-row gap-2">
//               <button
//                 type="button"
//                 className="btn btn-outline-primary flex-grow-1"
//                 onClick={() => handleResumeAction("view")}
//                 disabled={Boolean(resumeAction)}
//               >
//                 {resumeAction === "view" ? (
//                   <>
//                     <span className="spinner-border spinner-border-sm me-2" />
//                     Opening...
//                   </>
//                 ) : (
//                   <>
//                     <i className="bi bi-eye me-2" />
//                     View Resume
//                   </>
//                 )}
//               </button>

//               <button
//                 type="button"
//                 className="btn btn-primary flex-grow-1"
//                 onClick={() => handleResumeAction("download")}
//                 disabled={Boolean(resumeAction)}
//               >
//                 {resumeAction === "download" ? (
//                   <>
//                     <span className="spinner-border spinner-border-sm me-2" />
//                     Preparing...
//                   </>
//                 ) : (
//                   <>
//                     <i className="bi bi-download me-2" />
//                     Download
//                   </>
//                 )}
//               </button>
//             </div>

//             {resumeError && (
//               <div className="alert alert-danger mt-3 mb-0" role="alert">
//                 {resumeError}
//               </div>
//             )}

//             <small className="text-muted d-block mt-3">
//               This is the resume attached when you submitted this
//               application.
//             </small>
//           </>
//         ) : (
//           <div className="text-center py-4">
//             <i className="bi bi-file-earmark-x text-muted fs-1" />
//             <p className="text-muted mb-0 mt-2">
//               No resume was attached to this application.
//             </p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ApplicationResumeCard;
// ----------------------------------------------------------

import { useState } from "react";

import {
  getApplicationResumeDownloadUrl,
  downloadApplicationResumeFile,
} from "../../api/resume.api";

const formatFileSize = (bytes) => {
  if (!bytes) return "Size unavailable";

  const sizeInKB = bytes / 1024;

  if (sizeInKB >= 1024) {
    return `${(sizeInKB / 1024).toFixed(2)} MB`;
  }

  return `${sizeInKB.toFixed(2)} KB`;
};

const formatFileType = (mimeType) => {
  if (mimeType === "application/pdf") {
    return "PDF Document";
  }

  return mimeType || "File type unavailable";
};

const getDownloadFilename = (contentDisposition, fallbackName) => {
  if (!contentDisposition) return fallbackName || "resume.pdf";

  const utf8Match = contentDisposition.match(
    /filename\*=UTF-8''([^;]+)/i
  );

  if (utf8Match?.[1]) {
    try {
      return decodeURIComponent(utf8Match[1]);
    } catch {
      // Use the regular filename as a fallback.
    }
  }

  const filenameMatch = contentDisposition.match(
    /filename="?([^";]+)"?/i
  );

  return filenameMatch?.[1] || fallbackName || "resume.pdf";
};

const ApplicationResumeCard = ({ application }) => {
  const [resumeAction, setResumeAction] = useState("");
  const [resumeError, setResumeError] = useState("");

  const hasResume = Boolean(application?.resumeOriginalName);

  const handleResumeAction = async (action) => {
    if (!application?._id || resumeAction) return;

    setResumeError("");
    setResumeAction(action);

    let viewWindow = null;
    let blobUrl = "";

    // Open the tab immediately to avoid popup blocking.
    if (action === "view") {
      viewWindow = window.open("about:blank", "_blank");

      if (!viewWindow) {
        setResumeError(
          "Please allow pop-ups to view your submitted resume."
        );
        setResumeAction("");
        return;
      }

      viewWindow.opener = null;
    }

    try {
      if (action === "view") {
        // Request a short-lived Cloudinary viewing URL.
        const response = await getApplicationResumeDownloadUrl(
          application._id
        );

        const viewUrl = response?.data?.viewUrl;

        if (!viewUrl) {
          throw new Error(
            "Unable to generate the resume viewing link."
          );
        }

        // Let Cloudinary deliver the PDF directly to the browser.
        viewWindow.location.replace(viewUrl);
      } else {
        // Download through the backend to preserve the original filename.
        const response = await downloadApplicationResumeFile(
          application._id,
          "attachment"
        );

        const filename = getDownloadFilename(
          response.headers["content-disposition"],
          application.resumeOriginalName
        );

        const blob = new Blob([response.data], {
          type: "application/pdf",
        });

        blobUrl = window.URL.createObjectURL(blob);

        const downloadLink = document.createElement("a");

        downloadLink.href = blobUrl;
        downloadLink.download = filename;

        document.body.appendChild(downloadLink);
        downloadLink.click();
        downloadLink.remove();

        // Keep the Blob URL alive while the download starts.
        window.setTimeout(() => {
          window.URL.revokeObjectURL(blobUrl);
        }, 60000);
      }
    } catch (error) {
      if (viewWindow && !viewWindow.closed) {
        viewWindow.close();
      }

      setResumeError(
        error.response?.data?.message ||
          error.message ||
          "Unable to access the resume. Please try again."
      );
    } finally {
      setResumeAction("");
    }
  };

  return (
    <div className="card border-0 shadow-sm h-100">
      <div className="card-body p-4">
        <div className="d-flex align-items-center gap-2 mb-3">
          <i className="bi bi-file-earmark-pdf text-primary fs-4" />
          <h5 className="mb-0 fw-semibold">Submitted Resume</h5>
        </div>

        {hasResume ? (
          <>
            <div className="d-flex align-items-center gap-3 p-3 bg-light rounded-3 mb-3">
              <i className="bi bi-file-earmark-pdf text-danger fs-2" />

              <div className="flex-grow-1 min-w-0">
                <p className="fw-semibold text-break mb-1">
                  {application.resumeOriginalName}
                </p>

                <small className="text-muted">
                  {formatFileType(application.resumeMimeType)}
                  {" · "}
                  {formatFileSize(application.resumeSize)}
                </small>
              </div>
            </div>

            <div className="d-flex flex-wrap gap-2">
              <button
                type="button"
                className="btn btn-outline-primary btn-sm flex-grow-1"
                onClick={() => handleResumeAction("view")}
                disabled={Boolean(resumeAction)}
              >
                {resumeAction === "view" ? (
                  <span className="spinner-border spinner-border-sm me-1" />
                ) : (
                  <i className="bi bi-eye me-1" />
                )}
                View
              </button>

              <button
                type="button"
                className="btn btn-primary btn-sm flex-grow-1"
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

            {resumeError && (
              <div className="alert alert-danger mt-3 mb-0" role="alert">
                {resumeError}
              </div>
            )}

            <small className="text-muted d-block mt-3">
              This is the resume attached when you submitted this
              application.
            </small>
          </>
        ) : (
          <div className="text-center py-4">
            <i className="bi bi-file-earmark-x text-muted fs-1" />
            <p className="text-muted mb-0 mt-2">
              No resume was attached to this application.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationResumeCard;
