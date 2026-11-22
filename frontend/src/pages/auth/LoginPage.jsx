 
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { loginThunk } from "../../features/auth/authThunks";
import { clearAuthError } from "../../features/auth/authSlice";

function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { isLoading, error } = useSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    dispatch(clearAuthError());

    const credentials = {
      email: email.trim().toLowerCase(),
      password,
    };

    try {
      const result = await dispatch(loginThunk(credentials)).unwrap();

      const dashboardPath =
        result.user.role === "RECRUITER"
          ? "/recruiter/dashboard"
          : "/applicant/dashboard";

      const redirectPath = location.state?.from || dashboardPath;

      navigate(redirectPath, { replace: true });
    } catch {
      // Redux stores and displays the backend error.
    }
  };

  return (
    <main className="min-vh-100 d-flex align-items-center bg-light py-5">
      <div className="container">
        <div className="row justify-content-center align-items-center g-4">
          {/* Login introduction */}
          <div className="col-lg-5 d-none d-lg-block">
            <div className="pe-lg-5">
              <Link
                to="/"
                className="text-decoration-none d-inline-flex align-items-center gap-2 mb-4"
              >
                <span className="bg-primary text-white rounded-3 p-2">
                  <i className="bi bi-briefcase-fill fs-4" />
                </span>

                <span className="fs-3 fw-bold text-dark">
                  TalentHub
                </span>
              </Link>

              <h1 className="display-5 fw-bold mb-3">
                Find opportunities.
                <span className="text-primary"> Build your future.</span>
              </h1>

              <p className="text-secondary fs-5 mb-4">
                Sign in to manage your applications, discover opportunities,
                and connect with the right people.
              </p>

              <div className="d-flex align-items-center gap-3 mb-3">
                <i className="bi bi-check-circle-fill text-primary fs-5" />
                <span className="text-secondary">
                  Track your job applications
                </span>
              </div>

              <div className="d-flex align-items-center gap-3 mb-3">
                <i className="bi bi-check-circle-fill text-primary fs-5" />
                <span className="text-secondary">
                  Discover relevant opportunities
                </span>
              </div>

              <div className="d-flex align-items-center gap-3">
                <i className="bi bi-check-circle-fill text-primary fs-5" />
                <span className="text-secondary">
                  Get AI-powered career assistance
                </span>
              </div>
            </div>
          </div>

          {/* Login form */}
          <div className="col-12 col-md-9 col-lg-5">
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-body p-4 p-md-5">
                <div className="text-center mb-4">
                  <Link
                    to="/"
                    className="text-decoration-none d-lg-none"
                  >
                    <span className="fs-3 fw-bold text-primary">
                      TalentHub
                    </span>
                  </Link>

                  <h2 className="fw-bold mt-2 mb-2">Welcome back</h2>

                  <p className="text-secondary mb-0">
                    Sign in to continue to your account.
                  </p>
                </div>

                {error && (
                  <div className="alert alert-danger" role="alert">
                    <i className="bi bi-exclamation-circle me-2" />
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
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
                      onChange={(event) => {
                        setEmail(event.target.value);
                        if (error) dispatch(clearAuthError());
                      }}
                      maxLength={254}
                      autoComplete="email"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="password"
                      className="form-label fw-semibold"
                    >
                      Password
                    </label>

                    <div className="input-group input-group-lg">
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        className="form-control"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(event) => {
                          setPassword(event.target.value);
                          if (error) dispatch(clearAuthError());
                        }}
                        minLength={6}
                        maxLength={72}
                        autoComplete="current-password"
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
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary btn-lg w-100"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        />
                        Signing in...
                      </>
                    ) : (
                      <>
                        Sign In
                        <i className="bi bi-arrow-right ms-2" />
                      </>
                    )}
                  </button>
                </form>

                <div className="text-center mt-4">
                  <p className="text-secondary mb-2">
                    Don't have an account?
                  </p>

                  <div className="d-flex justify-content-center flex-wrap gap-3">
                    <Link
                      to="/register/applicant"
                      className="text-primary fw-semibold text-decoration-none"
                    >
                      Join as Applicant
                    </Link>

                    <span className="text-secondary">|</span>

                    <Link
                      to="/register/recruiter"
                      className="text-primary fw-semibold text-decoration-none"
                    >
                      Join as Recruiter
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-center text-secondary small mt-4">
              By signing in, you agree to use TalentHub responsibly.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

export default LoginPage;
