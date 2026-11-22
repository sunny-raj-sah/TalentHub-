
function JobExperienceFields({ experience, setExperience, errors = {} }) {
  const handleChange = (event) => {
    const { name, value } = event.target;

    setExperience((previousExperience) => ({
      ...previousExperience,
      [name]: value,
    }));
  };

  return (
    <div>
      <h6 className="fw-semibold mb-3">Experience Required</h6>

      <div className="row g-3">
        <div className="col-md-6">
          <label htmlFor="experienceMin" className="form-label">
            Minimum Experience (Years)
            <span className="text-danger"> *</span>
          </label>

          <input
            id="experienceMin"
            type="number"
            name="min"
            className={`form-control ${errors.min ? "is-invalid" : ""}`}
            placeholder="e.g. 0"
            min="0"
            step="1"
            value={experience.min}
            onChange={handleChange}
          />

          {errors.min && (
            <div className="invalid-feedback">{errors.min}</div>
          )}
        </div>

        <div className="col-md-6">
          <label htmlFor="experienceMax" className="form-label">
            Maximum Experience (Years)
            <span className="text-danger"> *</span>
          </label>

          <input
            id="experienceMax"
            type="number"
            name="max"
            className={`form-control ${errors.max ? "is-invalid" : ""}`}
            placeholder="e.g. 3"
            min="0"
            step="1"
            value={experience.max}
            onChange={handleChange}
          />

          {errors.max && (
            <div className="invalid-feedback">{errors.max}</div>
          )}
        </div>
      </div>

      <small className="text-muted d-block mt-2">
        For entry-level positions, set both values to 0.
      </small>
    </div>
  );
}

export default JobExperienceFields;
