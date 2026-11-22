
import { useEffect, useState } from "react";

function ApplicantSkills({ profile, onSave, isUpdating }) {
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState("");

  useEffect(() => {
    queueMicrotask(() => {
      setSkills(profile?.skills || []);
    });
  }, [profile]);

  const handleAddSkill = () => {
    const trimmedSkill = newSkill.trim();

    if (!trimmedSkill) return;

    if (trimmedSkill.length > 50) return;

    const alreadyExists = skills.some(
      (skill) => skill.toLowerCase() === trimmedSkill.toLowerCase()
    );

    if (alreadyExists || skills.length >= 50) return;

    setSkills((prev) => [...prev, trimmedSkill]);
    setNewSkill("");
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills((prev) =>
      prev.filter((skill) => skill !== skillToRemove)
    );
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSave({ skills });
  };

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-body p-4">
        <h5 className="card-title mb-1">Skills</h5>

        <p className="text-muted small mb-4">
          Add skills that describe your technical knowledge and expertise.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="e.g. React, Node.js, MongoDB"
              value={newSkill}
              maxLength={50}
              onChange={(event) => setNewSkill(event.target.value)}
            />

            <button
              type="button"
              className="btn btn-outline-primary"
              onClick={handleAddSkill}
              disabled={!newSkill.trim() || skills.length >= 50}
            >
              Add Skill
            </button>
          </div>

          <div className="d-flex flex-wrap gap-2 mb-4">
            {skills.length > 0 ? (
              skills.map((skill) => (
                <span
                  key={skill}
                  className="badge bg-light text-dark border px-3 py-2 d-flex align-items-center gap-2"
                >
                  {skill}

                  <button
                    type="button"
                    className="btn-close"
                    style={{ fontSize: "9px" }}
                    aria-label={`Remove ${skill}`}
                    onClick={() => handleRemoveSkill(skill)}
                  />
                </span>
              ))
            ) : (
              <p className="text-muted small mb-0">
                No skills added yet.
              </p>
            )}
          </div>

          <div className="d-flex justify-content-between align-items-center">
            <small className="text-muted">
              {skills.length}/50 skills
            </small>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={isUpdating}
            >
              {isUpdating ? "Saving..." : "Save Skills"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ApplicantSkills;
