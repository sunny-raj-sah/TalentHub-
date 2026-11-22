
function JobSalaryFields({ salary, setSalary, errors = {} }) {
  const handleChange = (event) => {
    const { name, value } = event.target;

    setSalary((previousSalary) => ({
      ...previousSalary,
      [name]: value,
    }));
  };

  return (
    <div>
      <h6 className="fw-semibold mb-3">Salary Range</h6>

      <div className="row g-3">
        <div className="col-md-4">
          <label htmlFor="salaryMin" className="form-label">
            Minimum Salary <span className="text-danger">*</span>
          </label>
          <input
            id="salaryMin"
            type="number"
            name="min"
            className={`form-control ${errors.min ? "is-invalid" : ""}`}
            placeholder="e.g. 300000"
            min="1"
            value={salary.min}
            onChange={handleChange}
          />
          {errors.min && (
            <div className="invalid-feedback">{errors.min}</div>
          )}
        </div>

        <div className="col-md-4">
          <label htmlFor="salaryMax" className="form-label">
            Maximum Salary <span className="text-danger">*</span>
          </label>
          <input
            id="salaryMax"
            type="number"
            name="max"
            className={`form-control ${errors.max ? "is-invalid" : ""}`}
            placeholder="e.g. 800000"
            min="1"
            value={salary.max}
            onChange={handleChange}
          />
          {errors.max && (
            <div className="invalid-feedback">{errors.max}</div>
          )}
        </div>

        <div className="col-md-4">
          <label htmlFor="salaryCurrency" className="form-label">
            Currency
          </label>
          <input
            id="salaryCurrency"
            type="text"
            name="currency"
            className={`form-control ${errors.currency ? "is-invalid" : ""}`}
            placeholder="INR"
            maxLength={3}
            value={salary.currency}
            onChange={(event) =>
              handleChange({
                target: {
                  name: "currency",
                  value: event.target.value.toUpperCase(),
                },
              })
            }
          />
          {errors.currency && (
            <div className="invalid-feedback">{errors.currency}</div>
          )}
        </div>
      </div>

      <small className="text-muted d-block mt-2">
        Enter the annual salary range. For example, ₹3,00,000 – ₹8,00,000.
      </small>
    </div>
  );
}

export default JobSalaryFields;
