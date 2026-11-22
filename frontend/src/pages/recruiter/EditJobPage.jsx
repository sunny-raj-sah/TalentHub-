 
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { getJobById } from "../../api/jobs.api";

import { updateRecruiterJobThunk } from "../../features/recruiter/recruiterThunks";

import {
  clearUpdateJobError,
  clearUpdatedJob,
} from "../../features/recruiter/recruiterSlice";

const initialFormData = {
  title: "",
  description: "",
  skills: "",
  salary: {
    min: "",
    max: "",
    currency: "INR",
  },
  experience: {
    min: "",
    max: "",
  },
  location: "",
  employmentType: "FULL_TIME",
  workMode: "ONSITE",
  applicationDeadline: "",
};

// Format a date for the HTML date input using local calendar values.
const formatDateForInput = (dateValue) => {
  if (!dateValue) return "";

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) return "";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

function EditJobPage() {
  const { jobId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    isUpdatingJob,
    updateJobError,
  } = useSelector((state) => state.recruiter);

  const [formData, setFormData] = useState(initialFormData);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    dispatch(clearUpdateJobError());
    dispatch(clearUpdatedJob());

    const loadJob = async () => {
      try {
        setIsLoading(true);
        setLoadError("");

        const response = await getJobById(jobId);
        const job = response.data?.job;

        if (!job) {
          throw new Error("Job details could not be loaded.");
        }

        setFormData({
          title: job.title || "",
          description: job.description || "",
          skills: Array.isArray(job.skills)
            ? job.skills.join(", ")
            : "",
          salary: {
            min: String(job.salary?.min ?? ""),
            max: String(job.salary?.max ?? ""),
            currency: job.salary?.currency || "INR",
          },
          experience: {
            min: String(job.experience?.min ?? ""),
            max: String(job.experience?.max ?? ""),
          },
          location: job.location || "",
          employmentType: job.employmentType || "FULL_TIME",
          workMode: job.workMode || "ONSITE",
          applicationDeadline: formatDateForInput(
            job.applicationDeadline
          ),
        });
      } catch (error) {
        setLoadError(
          error.response?.data?.message ||
            error.message ||
            "Unable to load job details."
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadJob();
  }, [dispatch, jobId]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setValidationErrors((previous) => ({
      ...previous,
      [name]: "",
    }));
  };

  const handleNestedChange = (section, field, value) => {
    setFormData((previous) => ({
      ...previous,
      [section]: {
        ...previous[section],
        [field]: value,
      },
    }));

    setValidationErrors((previous) => ({
      ...previous,
      [section]: "",
    }));
  };

  const validateForm = () => {
    const errors = {};

    if (formData.title.trim().length < 2) {
      errors.title = "Job title must contain at least 2 characters.";
    }

    if (formData.description.trim().length < 30) {
      errors.description =
        "Description must contain at least 30 characters.";
    }

    const skills = formData.skills
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean);

    if (skills.length < 1 || skills.length > 30) {
      errors.skills = "Enter between 1 and 30 skills.";
    } else if (skills.some((skill) => skill.length > 50)) {
      errors.skills = "Each skill must be 50 characters or fewer.";
    }

    const minSalary = Number(formData.salary.min);
    const maxSalary = Number(formData.salary.max);

    if (
      !formData.salary.min ||
      !formData.salary.max ||
      minSalary <= 0 ||
      maxSalary <= 0
    ) {
      errors.salary = "Enter valid minimum and maximum salaries.";
    } else if (minSalary > maxSalary) {
      errors.salary = "Minimum salary cannot exceed maximum salary.";
    }

    const minExperience = Number(formData.experience.min);
    const maxExperience = Number(formData.experience.max);

    if (
      formData.experience.min === "" ||
      formData.experience.max === "" ||
      minExperience < 0 ||
      maxExperience < 0
    ) {
      errors.experience = "Enter valid experience values.";
    } else if (minExperience > maxExperience) {
      errors.experience =
        "Minimum experience cannot exceed maximum experience.";
    }

    if (formData.location.trim().length < 2) {
      errors.location = "Enter a valid job location.";
    }

    if (!formData.applicationDeadline) {
      errors.applicationDeadline = "Select an application deadline.";
    } else {
      const deadline = new Date(
        `${formData.applicationDeadline}T23:59:59`
      );

      if (deadline <= new Date()) {
        errors.applicationDeadline =
          "Application deadline must be in the future.";
      }
    }

    setValidationErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    dispatch(clearUpdateJobError());

    if (!validateForm()) return;

    const jobData = {
      title: formData.title.trim(),
      description: formData.description.trim(),

      skills: formData.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean),

      salary: {
        min: Number(formData.salary.min),
        max: Number(formData.salary.max),
        currency: formData.salary.currency,
      },

      experience: {
        min: Number(formData.experience.min),
        max: Number(formData.experience.max),
      },

      location: formData.location.trim(),
      employmentType: formData.employmentType,
      workMode: formData.workMode,

      applicationDeadline: new Date(
        `${formData.applicationDeadline}T23:59:59`
      ).toISOString(),
    };

    try {
      await dispatch(
        updateRecruiterJobThunk({
          jobId,
          jobData,
        })
      ).unwrap();

      dispatch(clearUpdatedJob());

      navigate("/recruiter/jobs", {
        state: {
          successMessage: "Job updated successfully.",
        },
      });
    } catch {
      // The rejected thunk stores the error in recruiterSlice.
    }
  };

  if (isLoading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading job details...</p>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">{loadError}</div>

        <Link to="/recruiter/jobs" className="btn btn-outline-primary">
          Back to My Jobs
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="mb-4">
        <Link
          to="/recruiter/jobs"
          className="text-decoration-none small"
        >
          <i className="bi bi-arrow-left me-2"></i>
          Back to My Jobs
        </Link>

        <h2 className="fw-bold mt-3">Edit Job</h2>

        <p className="text-muted mb-0">
          Update the details of your job posting.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="card border-0 shadow-sm">
          <div className="card-body p-4">

            {updateJobError && (
              <div className="alert alert-danger" role="alert">
                {updateJobError}
              </div>
            )}

            {/* Job title */}
            <div className="mb-3">
              <label htmlFor="title" className="form-label fw-semibold">
                Job Title
              </label>

              <input
                id="title"
                name="title"
                type="text"
                className={`form-control ${
                  validationErrors.title ? "is-invalid" : ""
                }`}
                value={formData.title}
                onChange={handleChange}
                maxLength={150}
                required
              />

              {validationErrors.title && (
                <div className="invalid-feedback">
                  {validationErrors.title}
                </div>
              )}
            </div>

            {/* Description */}
            <div className="mb-3">
              <label
                htmlFor="description"
                className="form-label fw-semibold"
              >
                Job Description
              </label>

              <textarea
                id="description"
                name="description"
                className={`form-control ${
                  validationErrors.description ? "is-invalid" : ""
                }`}
                rows="6"
                value={formData.description}
                onChange={handleChange}
                maxLength={10000}
                required
              />

              {validationErrors.description && (
                <div className="invalid-feedback">
                  {validationErrors.description}
                </div>
              )}
            </div>

            {/* Skills */}
            <div className="mb-3">
              <label htmlFor="skills" className="form-label fw-semibold">
                Required Skills
              </label>

              <input
                id="skills"
                name="skills"
                type="text"
                className={`form-control ${
                  validationErrors.skills ? "is-invalid" : ""
                }`}
                value={formData.skills}
                onChange={handleChange}
                placeholder="React, Node.js, MongoDB"
              />

              <div className="form-text">
                Separate skills with commas.
              </div>

              {validationErrors.skills && (
                <div className="text-danger small mt-1">
                  {validationErrors.skills}
                </div>
              )}
            </div>

            {/* Salary */}
            <h5 className="fw-semibold mt-4 mb-3">Salary Details</h5>

            <div className="row">
              <div className="col-md-4 mb-3">
                <label className="form-label">Minimum Salary</label>

                <input
                  type="number"
                  min="1"
                  className="form-control"
                  value={formData.salary.min}
                  onChange={(event) =>
                    handleNestedChange(
                      "salary",
                      "min",
                      event.target.value
                    )
                  }
                />
              </div>

              <div className="col-md-4 mb-3">
                <label className="form-label">Maximum Salary</label>

                <input
                  type="number"
                  min="1"
                  className="form-control"
                  value={formData.salary.max}
                  onChange={(event) =>
                    handleNestedChange(
                      "salary",
                      "max",
                      event.target.value
                    )
                  }
                />
              </div>

              <div className="col-md-4 mb-3">
                <label className="form-label">Currency</label>

                <input
                  type="text"
                  className="form-control"
                  value={formData.salary.currency}
                  maxLength={3}
                  onChange={(event) =>
                    handleNestedChange(
                      "salary",
                      "currency",
                      event.target.value.toUpperCase()
                    )
                  }
                />
              </div>
            </div>

            {validationErrors.salary && (
              <div className="text-danger small mb-3">
                {validationErrors.salary}
              </div>
            )}

            {/* Experience */}
            <h5 className="fw-semibold mt-3 mb-3">
              Experience Required (Years)
            </h5>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Minimum Experience</label>

                <input
                  type="number"
                  min="0"
                  className="form-control"
                  value={formData.experience.min}
                  onChange={(event) =>
                    handleNestedChange(
                      "experience",
                      "min",
                      event.target.value
                    )
                  }
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Maximum Experience</label>

                <input
                  type="number"
                  min="0"
                  className="form-control"
                  value={formData.experience.max}
                  onChange={(event) =>
                    handleNestedChange(
                      "experience",
                      "max",
                      event.target.value
                    )
                  }
                />
              </div>
            </div>

            {validationErrors.experience && (
              <div className="text-danger small mb-3">
                {validationErrors.experience}
              </div>
            )}

            {/* Job details */}
            <h5 className="fw-semibold mt-3 mb-3">Job Details</h5>

            <div className="row">
              <div className="col-md-4 mb-3">
                <label htmlFor="location" className="form-label">
                  Location
                </label>

                <input
                  id="location"
                  name="location"
                  type="text"
                  className={`form-control ${
                    validationErrors.location ? "is-invalid" : ""
                  }`}
                  value={formData.location}
                  onChange={handleChange}
                  maxLength={150}
                />

                {validationErrors.location && (
                  <div className="invalid-feedback">
                    {validationErrors.location}
                  </div>
                )}
              </div>

              <div className="col-md-4 mb-3">
                <label
                  htmlFor="employmentType"
                  className="form-label"
                >
                  Employment Type
                </label>

                <select
                  id="employmentType"
                  name="employmentType"
                  className="form-select"
                  value={formData.employmentType}
                  onChange={handleChange}
                >
                  <option value="FULL_TIME">Full Time</option>
                  <option value="PART_TIME">Part Time</option>
                  <option value="INTERNSHIP">Internship</option>
                  <option value="CONTRACT">Contract</option>
                  <option value="FREELANCE">Freelance</option>
                </select>
              </div>

              <div className="col-md-4 mb-3">
                <label htmlFor="workMode" className="form-label">
                  Work Mode
                </label>

                <select
                  id="workMode"
                  name="workMode"
                  className="form-select"
                  value={formData.workMode}
                  onChange={handleChange}
                >
                  <option value="ONSITE">On-site</option>
                  <option value="REMOTE">Remote</option>
                  <option value="HYBRID">Hybrid</option>
                </select>
              </div>
            </div>

            {/* Application deadline */}
            <div className="mb-4">
              <label
                htmlFor="applicationDeadline"
                className="form-label fw-semibold"
              >
                Application Deadline
              </label>

              <input
                id="applicationDeadline"
                name="applicationDeadline"
                type="date"
                className={`form-control ${
                  validationErrors.applicationDeadline
                    ? "is-invalid"
                    : ""
                }`}
                value={formData.applicationDeadline}
                onChange={handleChange}
              />

              {validationErrors.applicationDeadline && (
                <div className="invalid-feedback">
                  {validationErrors.applicationDeadline}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="d-flex flex-wrap gap-2 justify-content-end">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => navigate("/recruiter/jobs")}
                disabled={isUpdatingJob}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={isUpdatingJob}
              >
                {isUpdatingJob ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Updating...
                  </>
                ) : (
                  <>
                    <i className="bi bi-check-circle me-2"></i>
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default EditJobPage;
