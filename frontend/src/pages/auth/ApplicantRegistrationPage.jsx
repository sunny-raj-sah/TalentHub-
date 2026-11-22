
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { registerApplicantThunk } from "../../features/auth/authThunks";
import { clearAuthError } from "../../features/auth/authSlice";

function ApplicantRegistrationPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isLoading, error } = useSelector((state) => state.auth);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationError, setValidationError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    dispatch(clearAuthError());
    setValidationError("");

    const trimmedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();

    if (trimmedName.length < 2) {
      setValidationError("Name must contain at least 2 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setValidationError("Passwords do not match.");
      return;
    }

    try {
      await dispatch(
        registerApplicantThunk({
          name: trimmedName,
          email: normalizedEmail,
          password,
        })
      ).unwrap();

      navigate("/applicant/dashboard", { replace: true });
    } catch {
      // Redux stores and displays the registration error.
    }
  };

  const handleFieldChange = (setter) => (event) => {
    setter(event.target.value);

    if (error) {
      dispatch(clearAuthError());
    }

    if (validationError) {
      setValidationError("");
    }
  };

  return (
    <div className="min-vh-100 bg-light d-flex align-items-center py-5">
      <div className="container">
        <div className="row justify-content-center align-items-center g-5">
          {/* Introduction */}
          <div className="col-lg-5 d-none d-lg-block">
            <Link
              to="/"
              className="text-decoration-none d-inline-flex align-items-center gap-2 mb-4"
            >
              <span
                className="d-inline-flex align-items-center justify-content-center rounded-3 text-white fw-bold"
                style={{
                  width: "42px",
                  height: "42px",
                  backgroundColor: "var(--th-primary)",
                }}
              >
                T
              </span>

              <span className="fs-4 fw-bold text-dark">TalentHub</span>
            </Link>

            <h1 className="display-5 fw-bold text-dark mb-3">
              Find opportunities that move your career forward.
            </h1>

            <p className="text-secondary fs-5 mb-4">
              Create your applicant account and discover opportunities
              that match your skills, interests, and career goals.
            </p>

            <div className="d-flex flex-column gap-3">
              {[
                "Discover relevant job opportunities",
                "Apply and track your applications",
                "Prepare for interviews with AI assistance",
              ].map((feature) => (
                <div key={feature} className="d-flex align-items-center gap-3">
                  <i className="bi bi-check-circle-fill text-primary fs-5" />
                  <span className="text-secondary">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Registration Form */}
          <div className="col-12 col-md-9 col-lg-5">
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-body p-4 p-md-5">
                <div className="text-center mb-4">
                  <Link
                    to="/"
                    className="text-decoration-none d-inline-flex align-items-center gap-2 mb-3 d-lg-none"
                  >
                    <span className="fs-4 fw-bold text-dark">
                      TalentHub
                    </span>
                  </Link>

                  <h2 className="fw-bold text-dark mb-2">
                    Create your account
                  </h2>

                  <p className="text-secondary mb-0">
                    Sign up as an applicant to get started.
                  </p>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label fw-semibold">
                      Full name
                    </label>

                    <input
                      id="name"
                      type="text"
                      className="form-control form-control-lg"
                      placeholder="Enter your full name"
                      value={name}
                      onChange={handleFieldChange(setName)}
                      minLength={2}
                      maxLength={80}
                      autoComplete="name"
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="email" className="form-label fw-semibold">
                      Email address
                    </label>

                    <input
                      id="email"
                      type="email"
                      className="form-control form-control-lg"
                      placeholder="you@example.com"
                      value={email}
                      onChange={handleFieldChange(setEmail)}
                      maxLength={254}
                      autoComplete="email"
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label
                      htmlFor="password"
                      className="form-label fw-semibold"
                    >
                      Password
                    </label>

                    <div className="input-group">
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        className="form-control form-control-lg"
                        placeholder="Create a password"
                        value={password}
                        onChange={handleFieldChange(setPassword)}
                        minLength={6}
                        maxLength={72}
                        autoComplete="new-password"
                        required
                      />

                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() =>
                          setShowPassword((previous) => !previous)
                        }
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                      >
                        <i
                          className={`bi ${
                            showPassword ? "bi-eye-slash" : "bi-eye"
                          }`}
                        />
                      </button>
                    </div>

                    <small className="text-secondary">
                      Use at least 6 characters.
                    </small>
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="confirmPassword"
                      className="form-label fw-semibold"
                    >
                      Confirm password
                    </label>

                    <div className="input-group">
                      <input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        className="form-control form-control-lg"
                        placeholder="Re-enter your password"
                        value={confirmPassword}
                        onChange={handleFieldChange(setConfirmPassword)}
                        minLength={6}
                        maxLength={72}
                        autoComplete="new-password"
                        required
                      />

                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() =>
                          setShowConfirmPassword((previous) => !previous)
                        }
                        aria-label={
                          showConfirmPassword
                            ? "Hide confirm password"
                            : "Show confirm password"
                        }
                      >
                        <i
                          className={`bi ${
                            showConfirmPassword ? "bi-eye-slash" : "bi-eye"
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  {(error || validationError) && (
                    <div className="alert alert-danger py-2" role="alert">
                      {validationError || error}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="btn btn-primary btn-lg w-100"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          aria-hidden="true"
                        />
                        Creating account...
                      </>
                    ) : (
                      "Create applicant account"
                    )}
                  </button>
                </form>

                <div className="text-center mt-4">
                  <p className="text-secondary mb-2">
                    Already have an account?{" "}
                    <Link
                      to="/login"
                      className="text-primary fw-semibold text-decoration-none"
                    >
                      Sign in
                    </Link>
                  </p>

                  <p className="text-secondary small mb-0">
                    Looking to hire?{" "}
                    <Link
                      to="/register/recruiter"
                      className="text-primary fw-semibold text-decoration-none"
                    >
                      Register as a recruiter
                    </Link>
                  </p>
                </div>
              </div>
            </div>

            <p className="text-center text-secondary small mt-3">
              By creating an account, you agree to use TalentHub responsibly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ApplicantRegistrationPage;
