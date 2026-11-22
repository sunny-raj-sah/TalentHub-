
import { useEffect, useState } from "react";

const initialExperience = {
  jobTitle: "",
  company: "",
  employmentType: "FULL_TIME",
  location: "",
  startDate: "",
  endDate: "",
  currentlyWorking: false,
  description: "",
};

function ApplicantExperience({ profile, onSave, isUpdating }) {
  const [experiences, setExperiences] = useState([]);
  const [formData, setFormData] = useState(initialExperience);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      setExperiences(
        (profile?.experience || []).map((item) => ({
          ...item,
          startDate: item.startDate
            ? item.startDate.slice(0, 10)
            : "",
          endDate: item.endDate
            ? item.endDate.slice(0, 10)
            : "",
        }))
      );
    });
  }, [profile]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
      ...(name === "currentlyWorking" && checked
        ? { endDate: "" }
        : {}),
    }));
  };

  const resetForm = () => {
    setFormData(initialExperience);
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (experience) => {
    setFormData({
      ...initialExperience,
      ...experience,
    });

    setEditingId(experience._id);
    setShowForm(true);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const experienceData = {
      ...formData,
      jobTitle: formData.jobTitle.trim(),
      company: formData.company.trim(),
      location: formData.location.trim(),
      description: formData.description.trim(),
      endDate: formData.currentlyWorking
        ? ""
        : formData.endDate,
    };

    let updatedExperiences;

    if (editingId) {
      updatedExperiences = experiences.map((item) =>
        item._id === editingId
          ? { ...experienceData, _id: editingId }
          : item
      );
    } else {
      updatedExperiences = [...experiences, experienceData];
    }

    setExperiences(updatedExperiences);
    resetForm();
  };

  const handleRemove = (experienceId) => {
    setExperiences((prev) =>
      prev.filter((item) => item._id !== experienceId)
    );
  };

  const handleSave = () => {
  onSave({
    experience: experiences.map((experience) => {
      return {
        jobTitle: experience.jobTitle,
        company: experience.company,
        employmentType: experience.employmentType,
        location: experience.location,
        startDate: experience.startDate,
        endDate: experience.endDate,
        currentlyWorking: experience.currentlyWorking,
        description: experience.description,
      };
    }),
  });
};

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-body p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h5 className="card-title mb-1">Work Experience</h5>
            <p className="text-muted small mb-0">
              Add your previous and current work experience.
            </p>
          </div>

          <button
            type="button"
            className="btn btn-outline-primary btn-sm"
            onClick={() => {
              setFormData(initialExperience);
              setEditingId(null);
              setShowForm(true);
            }}
          >
            Add Experience
          </button>
        </div>

        {experiences.length === 0 && !showForm && (
          <p className="text-muted small">
            No work experience added yet.
          </p>
        )}

        {experiences.map((experience) => (
          <div
            key={experience._id || `${experience.jobTitle}-${experience.company}`}
            className="border rounded p-3 mb-3"
          >
            <div className="d-flex justify-content-between gap-3">
              <div>
                <h6 className="mb-1">{experience.jobTitle}</h6>
                <p className="text-muted small mb-1">
                  {experience.company}
                  {experience.location && ` · ${experience.location}`}
                </p>
                <small className="text-muted">
                  {experience.employmentType.replaceAll("_", " ")}
                  {" · "}
                  {experience.startDate || "Start date not specified"}
                  {" – "}
                  {experience.currentlyWorking
                    ? "Present"
                    : experience.endDate || "End date not specified"}
                </small>
                {experience.description && (
                  <p className="small mt-2 mb-0">
                    {experience.description}
                  </p>
                )}
              </div>

              <div className="d-flex gap-2 align-items-start">
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary"
                  onClick={() => handleEdit(experience)}
                >
                  Edit
                </button>

                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => handleRemove(experience._id)}
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}

        {showForm && (
          <form
            className="border rounded p-3 mt-3"
            onSubmit={handleSubmit}
          >
            <h6 className="mb-3">
              {editingId ? "Edit Experience" : "Add Experience"}
            </h6>

            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Job Title *</label>
                <input
                  type="text"
                  className="form-control"
                  name="jobTitle"
                  value={formData.jobTitle}
                  onChange={handleChange}
                  maxLength={100}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Company *</label>
                <input
                  type="text"
                  className="form-control"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  maxLength={100}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Employment Type</label>
                <select
                  className="form-select"
                  name="employmentType"
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

              <div className="col-md-6">
                <label className="form-label">Location</label>
                <input
                  type="text"
                  className="form-control"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  maxLength={100}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Start Date</label>
                <input
                  type="date"
                  className="form-control"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">End Date</label>
                <input
                  type="date"
                  className="form-control"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  disabled={formData.currentlyWorking}
                />
              </div>

              <div className="col-12">
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="currentlyWorking"
                    name="currentlyWorking"
                    checked={formData.currentlyWorking}
                    onChange={handleChange}
                  />
                  <label
                    className="form-check-label"
                    htmlFor="currentlyWorking"
                  >
                    I currently work here
                  </label>
                </div>
              </div>

              <div className="col-12">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  name="description"
                  rows="3"
                  maxLength={2000}
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="d-flex gap-2 mt-3">
              <button type="submit" className="btn btn-primary btn-sm">
                {editingId ? "Update Entry" : "Add Entry"}
              </button>

              <button
                type="button"
                className="btn btn-outline-secondary btn-sm"
                onClick={resetForm}
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        <div className="d-flex justify-content-end mt-4">
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleSave}
            disabled={isUpdating}
          >
            {isUpdating ? "Saving..." : "Save Experience"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ApplicantExperience;
