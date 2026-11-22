
const EMPLOYMENT_TYPES = [
  { value: "FULL_TIME", label: "Full Time" },
  { value: "PART_TIME", label: "Part Time" },
  { value: "INTERNSHIP", label: "Internship" },
  { value: "CONTRACT", label: "Contract" },
  { value: "FREELANCE", label: "Freelance" },
];

const WORK_MODES = [
  { value: "ONSITE", label: "On-site" },
  { value: "REMOTE", label: "Remote" },
  { value: "HYBRID", label: "Hybrid" },
];

function JobDetailsFields({ formData, setFormData, errors = {} }) {
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  return (
    <div>
      <h6 className="fw-semibold mb-3">Job Details</h6>

      <div className="row g-3">
        <div className="col-12">
          <label htmlFor="jobLocation" className="form-label">
            Job Location <span className="text-danger">*</span>
          </label>

          <input
            id="jobLocation"
            type="text"
            name="location"
            className={`form-control ${errors.location ? "is-invalid" : ""}`}
            placeholder="e.g. Bangalore, India"
            maxLength={150}
            value={formData.location}
            onChange={handleChange}
          />

          {errors.location && (
            <div className="invalid-feedback">{errors.location}</div>
          )}
        </div>

        <div className="col-md-6">
          <label htmlFor="employmentType" className="form-label">
            Employment Type <span className="text-danger">*</span>
          </label>

          <select
            id="employmentType"
            name="employmentType"
            className={`form-select ${
              errors.employmentType ? "is-invalid" : ""
            }`}
            value={formData.employmentType}
            onChange={handleChange}
          >
            <option value="">Select employment type</option>

            {EMPLOYMENT_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>

          {errors.employmentType && (
            <div className="invalid-feedback">
              {errors.employmentType}
            </div>
          )}
        </div>

        <div className="col-md-6">
          <label htmlFor="workMode" className="form-label">
            Work Mode <span className="text-danger">*</span>
          </label>

          <select
            id="workMode"
            name="workMode"
            className={`form-select ${errors.workMode ? "is-invalid" : ""}`}
            value={formData.workMode}
            onChange={handleChange}
          >
            <option value="">Select work mode</option>

            {WORK_MODES.map((mode) => (
              <option key={mode.value} value={mode.value}>
                {mode.label}
              </option>
            ))}
          </select>

          {errors.workMode && (
            <div className="invalid-feedback">{errors.workMode}</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default JobDetailsFields;
