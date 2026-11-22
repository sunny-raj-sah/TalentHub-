 
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

function GuestRoute() {
  const location = useLocation();

  const { user, isAuthenticated, isInitializing } = useSelector(
    (state) => state.auth
  );

  if (isInitializing) {
    return (
      <div className="min-vh-100 d-flex justify-content-center align-items-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (isAuthenticated && user) {
    const dashboardPath =
      user.role === "RECRUITER"
        ? "/recruiter/dashboard"
        : "/applicant/dashboard";

    const redirectPath =
      location.state?.from?.pathname || dashboardPath;

    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
}

export default GuestRoute;
