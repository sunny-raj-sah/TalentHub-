
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

function ProtectedRoute({ allowedRoles = [] }) {
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

  if (!isAuthenticated || !user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    const redirectPath =
      user.role === "RECRUITER"
        ? "/recruiter/dashboard"
        : "/applicant/dashboard";

    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
