
import { useState } from "react";

function JobSkillsInput({ skills, setSkills, error }) {
  const [skillInput, setSkillInput] = useState("");

  const addSkill = () => {
    const newSkill = skillInput.trim();

    if (!newSkill) return;

    const alreadyExists = skills.some(
      (skill) => skill.toLowerCase() === newSkill.toLowerCase()
    );

    if (alreadyExists || skills.length >= 30 || newSkill.length > 50) {
      return;
    }

    setSkills([...skills, newSkill]);
    setSkillInput("");
  };

  const removeSkill = (skillToRemove) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      addSkill();
    }
  };

  return (
    <div>
      <label className="form-label fw-semibold">
        Required Skills <span className="text-danger">*</span>
      </label>

      <div className="input-group">
        <input
          type="text"
          className="form-control"
          placeholder="e.g. React, Node.js, MongoDB"
          value={skillInput}
          maxLength={50}
          onChange={(event) => setSkillInput(event.target.value)}
          onKeyDown={handleKeyDown}
        />

        <button
          type="button"
          className="btn btn-outline-primary"
          onClick={addSkill}
          disabled={
            !skillInput.trim() ||
            skills.length >= 30 ||
            skillInput.trim().length > 50
          }
        >
          <i className="bi bi-plus-lg me-1" />
          Add
        </button>
      </div>

      <small className="text-muted">
        Add between 1 and 30 skills. Press Enter or click Add.
      </small>

      {skills.length > 0 && (
        <div className="d-flex flex-wrap gap-2 mt-3">
          {skills.map((skill) => (
            <span
              key={skill}
              className="badge bg-primary-subtle text-primary border border-primary-subtle d-flex align-items-center gap-2 px-3 py-2"
            >
              {skill}

              <button
                type="button"
                className="btn-close"
                aria-label={`Remove ${skill}`}
                style={{ fontSize: "0.65rem" }}
                onClick={() => removeSkill(skill)}
              />
            </span>
          ))}
        </div>
      )}

      {error && (
        <div className="text-danger small mt-2">{error}</div>
      )}
    </div>
  );
}

export default JobSkillsInput;
