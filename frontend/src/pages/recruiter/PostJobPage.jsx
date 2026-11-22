
import { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { createRecruiterJobThunk } from "../../features/recruiter/recruiterThunks";

import JobSkillsInput from "../../components/recruiter/JobSkillsInput";
import JobSalaryFields from "../../components/recruiter/JobSalaryFields";
import JobExperienceFields from "../../components/recruiter/JobExperienceFields";
import JobDetailsFields from "../../components/recruiter/JobDetailsFields";
import JobDeadlineField from "../../components/recruiter/JobDeadlineField";

function PostJobPage() {
  const dispatch = useDispatch();

  const { isCreatingJob, createJobError, createdJob } = useSelector(
    (state) => state.recruiter
  );

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [skills, setSkills] = useState([]);

  const [salary, setSalary] = useState({
    min: "",
    max: "",
    currency: "INR",
  });

  const [experience, setExperience] = useState({
    min: "0",
    max: "0",
  });

  const [formData, setFormData] = useState({
    location: "",
    employmentType: "",
    workMode: "",
  });

  const [deadline, setDeadline] = useState("");

  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");

  const validateForm = () => {
    const newErrors = {};

    if (title.trim().length < 2) {
      newErrors.title = "Job title must contain at least 2 characters.";
    }

    if (title.trim().length > 150) {
      newErrors.title = "Job title cannot exceed 150 characters.";
    }

    if (description.trim().length < 30) {
      newErrors.description =
        "Description must contain at least 30 characters.";
    }

    if (description.trim().length > 10000) {
      newErrors.description =
        "Description cannot exceed 10000 characters.";
    }

    if (skills.length === 0) {
      newErrors.skills = "Please add at least one required skill.";
    }

    if (salary.min === "" || Number(salary.min) <= 0) {
      newErrors.salaryMin = "Enter a valid minimum salary.";
    }

    if (salary.max === "" || Number(salary.max) <= 0) {
      newErrors.salaryMax = "Enter a valid maximum salary.";
    }

    if (
      salary.min !== "" &&
      salary.max !== "" &&
      Number(salary.min) > Number(salary.max)
    ) {
      newErrors.salaryMax =
        "Maximum salary must be greater than or equal to minimum salary.";
    }

    if (!/^[A-Z]{3}$/.test(salary.currency)) {
      newErrors.salaryCurrency = "Enter a valid 3-letter currency code.";
    }

    if (
      experience.min === "" ||
      Number(experience.min) < 0
    ) {
      newErrors.experienceMin = "Enter a valid minimum experience.";
    }

    if (
      experience.max === "" ||
      Number(experience.max) < 0
    ) {
      newErrors.experienceMax = "Enter a valid maximum experience.";
    }

    if (
      experience.min !== "" &&
      experience.max !== "" &&
      Number(experience.min) > Number(experience.max)
    ) {
      newErrors.experienceMax =
        "Maximum experience must be greater than or equal to minimum experience.";
    }

    if (formData.location.trim().length < 2) {
      newErrors.location = "Enter a valid job location.";
    }

    if (!formData.employmentType) {
      newErrors.employmentType = "Select an employment type.";
    }

    if (!formData.workMode) {
      newErrors.workMode = "Select a work mode.";
    }

    if (!deadline) {
      newErrors.deadline = "Select an application deadline.";
    } else if (
      new Date(`${deadline}T23:59:59`) <= new Date()
    ) {
      newErrors.deadline = "Application deadline must be in the future.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSubmitError("");

    if (!validateForm()) {
      return;
    }

    const jobData = {
      title: title.trim(),
      description: description.trim(),
      skills,
      salary: {
        min: Number(salary.min),
        max: Number(salary.max),
        currency: salary.currency.toUpperCase(),
      },
      experience: {
        min: Number(experience.min),
        max: Number(experience.max),
      },
      location: formData.location.trim(),
      employmentType: formData.employmentType,
      workMode: formData.workMode,
      applicationDeadline: new Date(
        `${deadline}T23:59:59`
      ).toISOString(),
    };

    try {
      await dispatch(createRecruiterJobThunk(jobData)).unwrap();
    } catch (error) {
      setSubmitError(
        typeof error === "string"
          ? error
          : "Unable to create job. Please try again."
      );
    }
  };

  if (createdJob) {
    return (
      <div className="container py-5">
        <div className="card border-0 shadow-sm mx-auto text-center p-4"
          style={{ maxWidth: "600px" }}
        >
          <div className="mb-3">
            <i className="bi bi-check-circle-fill text-success fs-1" />
          </div>

          <h3 className="fw-bold">Job Posted Successfully!</h3>

          <p className="text-muted">
            Your job listing "{createdJob.title}" has been created.
          </p>

          <div className="d-flex justify-content-center gap-2 flex-wrap">
            <Link
              to="/recruiter/jobs"
              className="btn btn-primary"
            >
              View My Jobs
            </Link>

            <Link
              to="/recruiter/dashboard"
              className="btn btn-outline-secondary"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
        <div>
          <h2 className="fw-bold mb-1">Post a Job</h2>
          <p className="text-muted mb-0">
            Create a job listing to find the right candidates.
          </p>
        </div>

        <Link
          to="/recruiter/jobs"
          className="btn btn-outline-secondary"
        >
          <i className="bi bi-arrow-left me-2" />
          Back to My Jobs
        </Link>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body p-4">
            <h5 className="fw-bold mb-4">Basic Information</h5>

            <div className="mb-4">
              <label htmlFor="jobTitle" className="form-label fw-semibold">
                Job Title <span className="text-danger">*</span>
              </label>

              <input
                id="jobTitle"
                type="text"
                className={`form-control ${errors.title ? "is-invalid" : ""}`}
                placeholder="e.g. Full Stack Developer"
                maxLength={150}
                value={title}
                onChange={(event) => setTitle(event.target.value)}
              />

              {errors.title && (
                <div className="invalid-feedback">{errors.title}</div>
              )}
            </div>

            <div className="mb-4">
              <label htmlFor="jobDescription" className="form-label fw-semibold">
                Job Description <span className="text-danger">*</span>
              </label>

              <textarea
                id="jobDescription"
                className={`form-control ${
                  errors.description ? "is-invalid" : ""
                }`}
                rows={6}
                maxLength={10000}
                placeholder="Describe the role, responsibilities, and requirements..."
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              />

              {errors.description && (
                <div className="invalid-feedback">
                  {errors.description}
                </div>
              )}

              <small className="text-muted">
                {description.length}/10000 characters
              </small>
            </div>

            <JobSkillsInput
              skills={skills}
              setSkills={setSkills}
              error={errors.skills}
            />
          </div>
        </div>

        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body p-4">
            <JobSalaryFields
              salary={salary}
              setSalary={setSalary}
              errors={{
                min: errors.salaryMin,
                max: errors.salaryMax,
                currency: errors.salaryCurrency,
              }}
            />
          </div>
        </div>

        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body p-4">
            <JobExperienceFields
              experience={experience}
              setExperience={setExperience}
              errors={{
                min: errors.experienceMin,
                max: errors.experienceMax,
              }}
            />
          </div>
        </div>

        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body p-4">
            <JobDetailsFields
              formData={formData}
              setFormData={setFormData}
              errors={errors}
            />
          </div>
        </div>

        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body p-4">
            <JobDeadlineField
              deadline={deadline}
              setDeadline={setDeadline}
              error={errors.deadline}
            />
          </div>
        </div>

        {(submitError || createJobError) && (
          <div className="alert alert-danger" role="alert">
            {submitError || createJobError}
          </div>
        )}

        <div className="d-flex justify-content-end gap-2 mb-5">
          <Link
            to="/recruiter/jobs"
            className="btn btn-outline-secondary"
          >
            Cancel
          </Link>

          <button
            type="submit"
            className="btn btn-primary px-4"
            disabled={isCreatingJob}
          >
            {isCreatingJob ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  aria-hidden="true"
                />
                Posting...
              </>
            ) : (
              <>
                <i className="bi bi-plus-lg me-2" />
                Post Job
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default PostJobPage;
