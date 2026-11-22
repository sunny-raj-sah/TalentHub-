
const statusOptions = [
  { label: "All Jobs", value: "" },
  { label: "Active", value: "ACTIVE" },
  { label: "Archived", value: "ARCHIVED" },
];

function RecruiterJobsStatusFilter({
  status,
  onStatusChange,
  disabled = false,
}) {
  return (
    <div className="card border-0 shadow-sm mb-4">
      <div className="card-body">
        <div className="d-flex flex-wrap gap-2">
          {statusOptions.map((option) => (
            <button
              key={option.value || "ALL"}
              type="button"
              className={`btn ${
                status === option.value
                  ? "btn-primary"
                  : "btn-outline-secondary"
              }`}
              onClick={() => onStatusChange(option.value)}
              disabled={disabled}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default RecruiterJobsStatusFilter;
