
import { useEffect, useState } from "react";

function ApplicantPersonalInfo({
  user,
  profile,
  onSave,
  isUpdating,
}) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    photoUrl: "",
    bio: "",
  });

 useEffect(() => {
  const updateFormData = () => {
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      photoUrl: profile?.photoUrl || "",
      bio: profile?.bio || "",
    });
  };

  queueMicrotask(updateFormData);
}, [user, profile]);
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    onSave({
      name: formData.name.trim(),
      photoUrl: formData.photoUrl.trim(),
      bio: formData.bio.trim(),
    });
  };

  return (
    <div className="card border-0 shadow-sm mb-4">
      <div className="card-body p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h5 className="mb-0">Personal Information</h5>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                name="name"
                className="form-control"
                value={formData.name}
                onChange={handleChange}
                minLength={2}
                maxLength={80}
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-control"
                value={formData.email}
                readOnly
                disabled
              />
              <small className="text-muted">
                Email cannot be changed here.
              </small>
            </div>

            <div className="col-12">
              <label className="form-label">
                Profile Photo URL
              </label>
              <input
                type="url"
                name="photoUrl"
                className="form-control"
                placeholder="https://example.com/photo.jpg"
                value={formData.photoUrl}
                onChange={handleChange}
              />
            </div>

            <div className="col-12">
              <label className="form-label">
                Professional Bio
              </label>
              <textarea
                name="bio"
                className="form-control"
                rows="4"
                maxLength={1000}
                placeholder="Write a short introduction about yourself..."
                value={formData.bio}
                onChange={handleChange}
              />
              <small className="text-muted">
                {formData.bio.length}/1000 characters
              </small>
            </div>
          </div>

          <div className="d-flex justify-content-end mt-4">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isUpdating || !formData.name.trim()}
            >
              {isUpdating ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" />
                  Saving...
                </>
              ) : (
                "Save Personal Information"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ApplicantPersonalInfo;
