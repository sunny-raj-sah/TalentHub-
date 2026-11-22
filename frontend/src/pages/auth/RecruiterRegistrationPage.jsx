
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { registerRecruiterThunk } from "../../features/auth/authThunks";
import { clearAuthError } from "../../features/auth/authSlice";

function RecruiterRegistrationPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isLoading, error } = useSelector((state) => state.auth);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    dispatch(clearAuthError());

    const userData = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
    };

    try {
      await dispatch(registerRecruiterThunk(userData)).unwrap();

      navigate("/recruiter/dashboard", { replace: true });
    } catch {
      // Redux stores and displays the registration error.
    }
  };

  const handleFieldChange = (setter) => (event) => {
    setter(event.target.value);

    if (error) {
      dispatch(clearAuthError());
    }
  };

  return (
    <div className="min-vh-100 bg-light d-flex align-items-center py-5">
      <div className="container">
        <div className="row justify-content-center align-items-center g-5">
          <div className="col-lg-5 d-none d-lg-block">
            <Link
              to="/"
              className="text-decoration-none d-inline-flex align-items-center gap-2 mb-4"
            >
              <span className="bg-primary text-white rounded-3 p-2">
                <i className="bi bi-briefcase-fill fs-4" />
              </span>
              <span className="fs-3 fw-bold text-dark">TalentHub</span>
            </Link>

            <h1 className="display-5 fw-bold text-dark mb-3">
              Build your team with the right talent.
            </h1>

            <p className="text-secondary fs-5 mb-4">
              Create your recruiter account and make hiring simpler with
              TalentHub.
            </p>

            <div className="d-flex flex-column gap-3">
              <div className="d-flex align-items-center gap-3">
                <i className="bi bi-briefcase text-primary fs-4" />
                <span className="text-secondary">
                  Publish and manage job opportunities.
                </span>
              </div>

              <div className="d-flex align-items-center gap-3">
                <i className="bi bi-people text-primary fs-4" />
                <span className="text-secondary">
                  Review and manage applicant applications.
                </span>
              </div>

              <div className="d-flex align-items-center gap-3">
                <i className="bi bi-robot text-primary fs-4" />
                <span className="text-secondary">
                  Get AI assistance throughout your hiring workflow.
                </span>
              </div>
            </div>
          </div>

          <div className="col-12 col-md-9 col-lg-5">
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-body p-4 p-md-5">
                <div className="mb-4">
                  <Link
                    to="/"
                    className="text-decoration-none d-lg-none d-inline-flex align-items-center gap-2 mb-4"
                  >
                    <i className="bi bi-briefcase-fill text-primary fs-3" />
                    <span className="fs-4 fw-bold text-dark">TalentHub</span>
                  </Link>

                  <h2 className="fw-bold text-dark mb-2">
                    Create recruiter account
                  </h2>

                  <p className="text-secondary mb-0">
                    Start finding the right people for your team.
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
                      Work email
                    </label>

                    <input
                      id="email"
                      type="email"
                      className="form-control form-control-lg"
                      placeholder="you@company.com"
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
                      Password must contain at least 6 characters.
                    </small>
                  </div>

                  {error && (
                    <div className="alert alert-danger py-2" role="alert">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="btn btn-primary btn-lg w-100 mt-2"
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
                      "Create recruiter account"
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
                    Looking for a job?
                    {" "}
                    <Link
                      to="/register/applicant"
                      className="text-primary fw-semibold text-decoration-none"
                    >
                      Register as an applicant
                    </Link>
                  </p>
                </div>
              </div>
            </div>

            <p className="text-center text-secondary small mt-4">
              By creating an account, you agree to use TalentHub responsibly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecruiterRegistrationPage;
