
import { useEffect, useState } from "react";

function RecruiterProfileHeader({profile }) {
  const [imageError, setImageError] = useState(false);

  const companyName = profile?.companyName?.trim() || "Your Company";

  const initials = companyName
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  useEffect(() => {
   queueMicrotask(() => {
    setImageError(false);
  });
  }, [profile?.companyLogoUrl]);

  return (
    <div className="card border-0 shadow-sm mb-4">
      <div className="card-body p-4">
        <div className="d-flex flex-column flex-sm-row align-items-sm-center gap-3">
          {profile?.companyLogoUrl && !imageError ? (
            <img
              src={profile.companyLogoUrl}
              alt={`${companyName} logo`}
              onError={() => setImageError(true)}
              className="rounded-3 border bg-white"
              style={{
                width: "88px",
                height: "88px",
                objectFit: "contain",
                padding: "8px",
              }}
            />
          ) : (
            <div
              className="rounded-3 bg-primary text-white d-flex align-items-center justify-content-center fw-bold"
              style={{
                width: "88px",
                height: "88px",
                fontSize: "28px",
                flexShrink: 0,
              }}
            >
              {initials || "CO"}
            </div>
          )}

          <div className="flex-grow-1">
            <h3 className="fw-bold mb-1">{companyName}</h3>

            {profile?.website ? (
              <a
                href={profile.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-decoration-none text-muted"
              >
                <i className="bi bi-globe2 me-2" />
                {profile.website}
                <i className="bi bi-box-arrow-up-right ms-2 small" />
              </a>
            ) : (
              <p className="text-muted mb-1">
                Add your company website
              </p>
            )}

            <div className="mt-2">
              <span className="badge bg-primary-subtle text-primary">
                <i className="bi bi-building me-1" />
                Recruiter
              </span>
            </div>
          </div>
        </div>

        <hr className="my-4" />

        <div>
          <h6 className="fw-semibold mb-2">About the Company</h6>
          <p className="text-muted mb-0" style={{ lineHeight: 1.7 }}>
            {profile?.aboutCompany?.trim() ||
              "Add a description of your company to introduce your organization to potential applicants."}
          </p>
        </div>
      </div>
    </div>
  );
}

export default RecruiterProfileHeader;
