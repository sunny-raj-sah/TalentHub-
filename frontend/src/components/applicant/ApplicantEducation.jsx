
import { useEffect, useState } from "react";

const initialEducation = {
  institution: "",
  degree: "",
  fieldOfStudy: "",
  startYear: "",
  endYear: "",
  description: "",
};

function ApplicantEducation({ profile, onSave, isUpdating }) {
  const [educationList, setEducationList] = useState([]);
  const [formData, setFormData] = useState(initialEducation);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      setEducationList(profile?.education || []);
    });
  }, [profile]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData(initialEducation);
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (education) => {
    setFormData({
      ...initialEducation,
      ...education,
      startYear: education.startYear || "",
      endYear: education.endYear || "",
    });

    setEditingId(education._id);
    setShowForm(true);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const educationData = {
      institution: formData.institution.trim(),
      degree: formData.degree.trim(),
      fieldOfStudy: formData.fieldOfStudy.trim(),
      startYear: Number(formData.startYear),
      endYear: formData.endYear
        ? Number(formData.endYear)
        : undefined,
      description: formData.description.trim(),
    };

    let updatedEducation;

    if (editingId) {
      updatedEducation = educationList.map((item) =>
        item._id === editingId
          ? { ...educationData, _id: editingId }
          : item
      );
    } else {
      updatedEducation = [...educationList, educationData];
    }

    setEducationList(updatedEducation);
    resetForm();
  };

  const handleRemove = (educationId) => {
    setEducationList((prev) =>
      prev.filter((item) => item._id !== educationId)
    );
  };

  const handleSave = () => {
    onSave({
      education: educationList.map((education) => ({
        institution: education.institution,
        degree: education.degree,
        fieldOfStudy: education.fieldOfStudy,
        startYear: Number(education.startYear),
        endYear: education.endYear
          ? Number(education.endYear)
          : undefined,
        description: education.description,
      })),
    });
  };

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-body p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h5 className="card-title mb-1">Education</h5>
            <p className="text-muted small mb-0">
              Add your academic qualifications and educational background.
            </p>
          </div>

          <button
            type="button"
            className="btn btn-outline-primary btn-sm"
            onClick={() => {
              setFormData(initialEducation);
              setEditingId(null);
              setShowForm(true);
            }}
          >
            Add Education
          </button>
        </div>

        {educationList.length === 0 && !showForm && (
          <p className="text-muted small">
            No education details added yet.
          </p>
        )}

        {educationList.map((education) => (
          <div
            key={
              education._id ||
              `${education.institution}-${education.degree}-${education.startYear}`
            }
            className="border rounded p-3 mb-3"
          >
            <div className="d-flex justify-content-between gap-3">
              <div>
                <h6 className="mb-1">{education.institution}</h6>

                <p className="text-muted small mb-1">
                  {education.degree}
                  {education.fieldOfStudy &&
                    ` · ${education.fieldOfStudy}`}
                </p>

                <small className="text-muted">
                  {education.startYear || "Start year not specified"}
                  {" – "}
                  {education.endYear || "Present"}
                </small>

                {education.description && (
                  <p className="small mt-2 mb-0">
                    {education.description}
                  </p>
                )}
              </div>

              <div className="d-flex gap-2 align-items-start">
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary"
                  onClick={() => handleEdit(education)}
                >
                  Edit
                </button>

                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => handleRemove(education._id)}
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
              {editingId ? "Edit Education" : "Add Education"}
            </h6>

            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">
                  Institution *
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="institution"
                  value={formData.institution}
                  onChange={handleChange}
                  maxLength={150}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Degree *</label>
                <input
                  type="text"
                  className="form-control"
                  name="degree"
                  value={formData.degree}
                  onChange={handleChange}
                  maxLength={100}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Field of Study</label>
                <input
                  type="text"
                  className="form-control"
                  name="fieldOfStudy"
                  value={formData.fieldOfStudy}
                  onChange={handleChange}
                  maxLength={100}
                />
              </div>

              <div className="col-md-3">
                <label className="form-label">Start Year *</label>
                <input
                  type="number"
                  className="form-control"
                  name="startYear"
                  value={formData.startYear}
                  onChange={handleChange}
                  min="1950"
                  max="2100"
                  required
                />
              </div>

              <div className="col-md-3">
                <label className="form-label">End Year</label>
                <input
                  type="number"
                  className="form-control"
                  name="endYear"
                  value={formData.endYear}
                  onChange={handleChange}
                  min="1950"
                  max="2100"
                />
              </div>

              <div className="col-12">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  name="description"
                  rows="3"
                  maxLength={1000}
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="d-flex gap-2 mt-3">
              <button
                type="submit"
                className="btn btn-primary btn-sm"
              >
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
            {isUpdating ? "Saving..." : "Save Education"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ApplicantEducation;
