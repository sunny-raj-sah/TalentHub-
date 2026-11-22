
// const formatDate = (date) => {
//   if (!date) return "Date unavailable";

//   return new Date(date).toLocaleDateString("en-IN", {
//     day: "numeric",
//     month: "short",
//     year: "numeric",
//   });
// };

// const statusStyles = {
//   PENDING: "bg-warning-subtle text-warning-emphasis",
//   SHORTLISTED: "bg-success-subtle text-success-emphasis",
//   REJECTED: "bg-danger-subtle text-danger-emphasis",
//   WITHDRAWN: "bg-secondary-subtle text-secondary-emphasis",
// };

// function RecruiterApplicationCard({
//   application,
//   onUpdateStatus,
//   onViewDetails,
//   isUpdating = false,
// }) {
//   const applicant = application.applicant || {};
//   const status = application.status;

//   return (
//     <div className="card border-0 shadow-sm mb-3">
//       <div className="card-body p-3 p-md-4">
//         <div className="d-flex flex-column flex-md-row justify-content-between gap-3">
//           <div>
//             <h5 className="mb-1">
//               {applicant.name || "Applicant"}
//             </h5>

//             <p className="text-muted mb-2">
//               <i className="bi bi-envelope me-2" />
//               {applicant.email || "Email unavailable"}
//             </p>

//             <small className="text-muted">
//               <i className="bi bi-calendar3 me-2" />
//               Applied on {formatDate(application.appliedAt)}
//             </small>
//           </div>

//           <div>
//             <span
//               className={`badge rounded-pill px-3 py-2 ${
//                 statusStyles[status] ||
//                 "bg-secondary-subtle text-secondary"
//               }`}
//             >
//               {status?.replaceAll("_", " ") || "Unknown"}
//             </span>
//           </div>
//         </div>

//         {application.coverLetter && (
//           <div className="mt-3">
//             <h6 className="mb-2">Cover Letter</h6>

//             <p
//               className="text-muted mb-0"
//               style={{ whiteSpace: "pre-wrap" }}
//             >
//               {application.coverLetter}
//             </p>
//           </div>
//         )}

//         {application.resumeOriginalName && (
//           <div className="mt-3">
//             <small className="text-muted">
//               <i className="bi bi-file-earmark-pdf me-2" />
//               Resume: {application.resumeOriginalName}
//             </small>
//           </div>
//         )}

//         <div className="d-flex flex-wrap gap-2 mt-4">
//           <button
//             type="button"
//             className="btn btn-outline-primary btn-sm"
//             onClick={() => onViewDetails(application._id)}
//           >
//             <i className="bi bi-person-lines-fill me-1" />
//             View Full Details
//           </button>

//           {status === "PENDING" && (
//             <>
//               <button
//                 type="button"
//                 className="btn btn-success btn-sm"
//                 disabled={isUpdating}
//                 onClick={() =>
//                   onUpdateStatus(application._id, "SHORTLISTED")
//                 }
//               >
//                 {isUpdating ? (
//                   <>
//                     <span className="spinner-border spinner-border-sm me-2" />
//                     Updating...
//                   </>
//                 ) : (
//                   <>
//                     <i className="bi bi-check-circle me-1" />
//                     Shortlist
//                   </>
//                 )}
//               </button>

//               <button
//                 type="button"
//                 className="btn btn-outline-danger btn-sm"
//                 disabled={isUpdating}
//                 onClick={() =>
//                   onUpdateStatus(application._id, "REJECTED")
//                 }
//               >
//                 <i className="bi bi-x-circle me-1" />
//                 Reject
//               </button>
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default RecruiterApplicationCard;
// -------------------------------------------------------------------
 
import { useState } from "react";

const formatDate = (date) => {
  if (!date) return "Date unavailable";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const statusStyles = {
  PENDING: "bg-warning-subtle text-warning-emphasis",
  SHORTLISTED: "bg-success-subtle text-success-emphasis",
  REJECTED: "bg-danger-subtle text-danger-emphasis",
  WITHDRAWN: "bg-secondary-subtle text-secondary-emphasis",
};

const availableStatuses = ["PENDING", "SHORTLISTED", "REJECTED"];

function RecruiterApplicationCard({
  application,
  onUpdateStatus,
  onViewDetails,
  isUpdating = false,
}) {
  const applicant = application.applicant || {};

  const [selectedStatus, setSelectedStatus] = useState(
    application.status
  );

  const isWithdrawn = application.status === "WITHDRAWN";
  const hasStatusChanged = selectedStatus !== application.status;

  const handleSaveStatus = () => {
    if (!hasStatusChanged || isUpdating || isWithdrawn) return;

    onUpdateStatus(application._id, selectedStatus);
  };

  return (
    <div className="card border-0 shadow-sm mb-3">
      <div className="card-body p-3 p-md-4">
        {/* Applicant Information */}
        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-start gap-3">
          <div className="flex-grow-1">
            <h5 className="fw-semibold mb-2">
              {applicant.name || "Applicant"}
            </h5>

            <div className="d-flex flex-column gap-2">
              <small className="text-muted">
                <i className="bi bi-envelope me-2" />
                {applicant.email || "Email unavailable"}
              </small>

              <small className="text-muted">
                <i className="bi bi-calendar3 me-2" />
                Applied on {formatDate(application.appliedAt)}
              </small>
            </div>
          </div>

          <div>
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

        {/* Cover Letter */}
        {application.coverLetter && (
          <div className="mt-4">
            <h6 className="fw-semibold mb-2">Cover Letter</h6>

            <p
              className="text-muted mb-0"
              style={{
                whiteSpace: "pre-wrap",
                overflowWrap: "anywhere",
              }}
            >
              {application.coverLetter}
            </p>
          </div>
        )}

        {/* Resume Information */}
        {application.resumeOriginalName && (
          <div className="mt-3">
            <small className="text-muted">
              <i className="bi bi-file-earmark-pdf me-2" />
              Resume: {application.resumeOriginalName}
            </small>
          </div>
        )}

        <hr className="my-4" />

        {/* Card Actions */}
        <div className="d-flex flex-column flex-lg-row justify-content-between align-items-stretch align-items-lg-end gap-3">
          {/* View Details */}
          <div>
            <button
              type="button"
              className="btn btn-outline-primary btn-sm w-100 w-lg-auto"
              onClick={() => onViewDetails(application._id)}
            >
              <i className="bi bi-person-lines-fill me-1" />
              View Full Details
            </button>
          </div>

          {/* Status Update */}
          <div className="d-flex flex-column flex-sm-row align-items-stretch align-items-sm-end gap-2">
            <div className="flex-grow-1">
              <label
                className="form-label small fw-semibold mb-1"
                htmlFor={`status-${application._id}`}
              >
                Change Application Status
              </label>

              <select
                id={`status-${application._id}`}
                className="form-select form-select-sm"
                style={{ minWidth: "180px" }}
                value={selectedStatus}
                disabled={isUpdating || isWithdrawn}
                onChange={(event) =>
                  setSelectedStatus(event.target.value)
                }
              >
                {availableStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status.replaceAll("_", " ")}
                  </option>
                ))}

                {isWithdrawn && (
                  <option value="WITHDRAWN">
                    WITHDRAWN
                  </option>
                )}
              </select>
            </div>

            <button
              type="button"
              className="btn btn-primary btn-sm"
              style={{ minWidth: "125px" }}
              disabled={
                !hasStatusChanged || isUpdating || isWithdrawn
              }
              onClick={handleSaveStatus}
            >
              {isUpdating ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" />
                  Updating...
                </>
              ) : (
                <>
                  <i className="bi bi-check2 me-1" />
                  Save Status
                </>
              )}
            </button>
          </div>
        </div>

        {isWithdrawn && (
          <small className="text-muted d-block mt-3">
            <i className="bi bi-info-circle me-1" />
            This application was withdrawn by the applicant. Its status
            cannot be changed.
          </small>
        )}
      </div>
    </div>
  );
}

export default RecruiterApplicationCard;
