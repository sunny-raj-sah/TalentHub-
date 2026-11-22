
import { useEffect, useState } from "react";

function RecruiterCompanyInfo({
  profile,
  onSave,
  isUpdating,
}) {
  const [formData, setFormData] = useState({
    companyName: "",
    companyLogoUrl: "",
    website: "",
    aboutCompany: "",
  });

  const [logoPreviewError, setLogoPreviewError] = useState(false);

  useEffect(() => {
    const updateFormData = () => {
      setFormData({
        companyName: profile?.companyName || "",
        companyLogoUrl: profile?.companyLogoUrl || "",
        website: profile?.website || "",
        aboutCompany: profile?.aboutCompany || "",
      });

      setLogoPreviewError(false);
    };

    queueMicrotask(updateFormData);
  }, [profile]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (name === "companyLogoUrl") {
      setLogoPreviewError(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    onSave({
      companyName: formData.companyName.trim(),
      companyLogoUrl: formData.companyLogoUrl.trim(),
      website: formData.website.trim(),
      aboutCompany: formData.aboutCompany.trim(),
    });
  };

//   const companyInitials = formData.companyName
//     .trim()
//     .split(" ")
//     .filter(Boolean)
//     .map((part) => part[0])
//     .join("")
//     .slice(0, 2)
//     .toUpperCase();

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-body p-4">
        <div className="mb-4">
          <div className="d-flex align-items-center gap-2 mb-2">
            <i className="bi bi-building text-primary fs-5" />
            <h5 className="fw-bold mb-0">Company Information</h5>
          </div>

          <p className="text-muted mb-0">
            Manage your company details and how applicants see your organization.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="row g-4">
            <div className="col-12">
              <label className="form-label fw-semibold">
                Company Name <span className="text-danger">*</span>
              </label>

              <input
                type="text"
                name="companyName"
                className="form-control"
                placeholder="Enter your company name"
                value={formData.companyName}
                onChange={handleChange}
                minLength={2}
                maxLength={150}
                required
              />
            </div>

            <div className="col-12">
              <label className="form-label fw-semibold">
                Company Logo URL
              </label>

              <div className="row g-3 align-items-center">
                <div className="col-md-8">
                  <input
                    type="url"
                    name="companyLogoUrl"
                    className="form-control"
                    placeholder="https://example.com/company-logo.png"
                    value={formData.companyLogoUrl}
                    onChange={handleChange}
                  />

                  <small className="text-muted">
                    Paste a publicly accessible image URL.
                  </small>
                </div>

                <div className="col-md-4">
                  <div
                    className="border rounded-3 bg-light d-flex align-items-center justify-content-center mx-auto"
                    style={{
                      width: "100%",
                      maxWidth: "130px",
                      height: "100px",
                    }}
                  >
                    {formData.companyLogoUrl && !logoPreviewError ? (
                      <img
                        src={formData.companyLogoUrl}
                        alt="Company logo preview"
                        onError={() => setLogoPreviewError(true)}
                        className="img-fluid rounded-2"
                        style={{
                          maxWidth: "100%",
                          maxHeight: "100%",
                          objectFit: "contain",
                        }}
                      />
                    ) : (
                      <div className="text-center text-muted">
                        <i className="bi bi-image fs-3 d-block" />
                        <small>
                          {logoPreviewError ? "Invalid image" : "Logo Preview"}
                        </small>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12">
              <label className="form-label fw-semibold">
                Company Website
              </label>

              <div className="input-group">
                <span className="input-group-text bg-light">
                  <i className="bi bi-globe2" />
                </span>

                <input
                  type="url"
                  name="website"
                  className="form-control"
                  placeholder="https://www.example.com"
                  value={formData.website}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="col-12">
              <label className="form-label fw-semibold">
                About Company
              </label>

              <textarea
                name="aboutCompany"
                className="form-control"
                rows="5"
                maxLength={2000}
                placeholder="Tell applicants about your company, its mission, culture, and what makes it a great place to work..."
                value={formData.aboutCompany}
                onChange={handleChange}
              />

              <div className="d-flex justify-content-end mt-1">
                <small className="text-muted">
                  {formData.aboutCompany.length}/2000 characters
                </small>
              </div>
            </div>
          </div>

          <hr className="my-4" />

          <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3">
            <small className="text-muted">
              <i className="bi bi-info-circle me-1" />
              Keep your company information up to date.
            </small>

            <button
              type="submit"
              className="btn btn-primary px-4"
              disabled={isUpdating || !formData.companyName.trim()}
            >
              {isUpdating ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" />
                  Saving...
                </>
              ) : (
                <>
                  <i className="bi bi-check2-circle me-2" />
                  Save Company Profile
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RecruiterCompanyInfo;
