
function ApplicantProfileHeader({ user, profile }) {
  const initials = (user?.name || "Applicant")
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="card border-0 shadow-sm mb-4">
      <div className="card-body p-4">
        <div className="d-flex align-items-center gap-3">
          {profile?.photoUrl ? (
            <img
              src={profile.photoUrl}
              alt={user?.name || "Applicant"}
              className="rounded-circle"
              style={{
                width: "80px",
                height: "80px",
                objectFit: "cover",
              }}
            />
          ) : (
            <div
              className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold"
              style={{
                width: "80px",
                height: "80px",
                fontSize: "26px",
              }}
            >
              {initials}
            </div>
          )}

          <div>
            <h3 className="mb-1">
              {user?.name || "Your Name"}
            </h3>

            <p className="text-muted mb-1">
              {user?.email}
            </p>

            <span className="badge bg-primary-subtle text-primary">
              Applicant
            </span>
          </div>
        </div>

        <div className="mt-3">
          <p className="text-muted mb-0">
            {profile?.bio || "Add a short professional bio to introduce yourself."}
          </p>
        </div>
      </div>
    </div>
  );
}

export default ApplicantProfileHeader;
