
function JobDeadlineField({ deadline, setDeadline, error }) {
  const today = new Date();
  const localDate = new Date(
    today.getTime() - today.getTimezoneOffset() * 60000
  )
    .toISOString()
    .split("T")[0];

  return (
    <div>
      <label htmlFor="applicationDeadline" className="form-label fw-semibold">
        Application Deadline <span className="text-danger">*</span>
      </label>

      <input
        id="applicationDeadline"
        type="date"
        className={`form-control ${error ? "is-invalid" : ""}`}
        min={localDate}
        value={deadline}
        onChange={(event) => setDeadline(event.target.value)}
      />

      {error && <div className="invalid-feedback">{error}</div>}

      <small className="text-muted d-block mt-2">
        Select the last date candidates can apply for this job.
      </small>
    </div>
  );
}

export default JobDeadlineField;
