// // import { useDispatch, useSelector } from "react-redux";
// // import { NavLink, useNavigate } from "react-router-dom";

// // import { logoutThunk } from "../../features/auth/authThunks";
// // import { getDashboardPath } from "../../utils/auth.utils";

// // function PublicNavbar() {
// //   const dispatch = useDispatch();
// //   const navigate = useNavigate();

// //   const { user, isAuthenticated, isLoading } = useSelector(
// //     (state) => state.auth
// //   );

// //   const handleLogout = async () => {
// //     await dispatch(logoutThunk());
// //     navigate("/", { replace: true });
// //   };

// //   const dashboardPath = getDashboardPath(user?.role);

// //   const getNavLinkClass = ({ isActive }) =>
// //     `nav-link fw-medium ${isActive ? "active text-primary" : "text-secondary"}`;

// //   return (
// //     <nav className="navbar navbar-expand-lg bg-white border-bottom sticky-top">
// //       <div className="container py-2">
// //         {/* Brand */}
// //         <NavLink
// //           to="/"
// //           className="navbar-brand d-flex align-items-center gap-2"
// //         >
// //           <span
// //             className="d-flex align-items-center justify-content-center rounded-3 bg-primary text-white fw-bold"
// //             style={{ width: "38px", height: "38px" }}
// //           >
// //             T
// //           </span>

// //           <span className="fw-bold fs-4" style={{ color: "var(--th-heading)" }}>
// //             TalentHub
// //           </span>
// //         </NavLink>

// //         {/* Mobile menu toggle */}
// //         <button
// //           className="navbar-toggler border-0 shadow-none"
// //           type="button"
// //           data-bs-toggle="collapse"
// //           data-bs-target="#publicNavbar"
// //           aria-controls="publicNavbar"
// //           aria-expanded="false"
// //           aria-label="Toggle navigation"
// //         >
// //           <span className="navbar-toggler-icon" />
// //         </button>

// //         {/* Navigation links */}
// //         <div className="collapse navbar-collapse" id="publicNavbar">
// //           <ul className="navbar-nav mx-auto gap-lg-3 mt-3 mt-lg-0">
// //             <li className="nav-item">
// //               <NavLink to="/" end className={getNavLinkClass}>
// //                 Home
// //               </NavLink>
// //             </li>

// //             <li className="nav-item">
// //               <NavLink to="/jobs" className={getNavLinkClass}>
// //                 Explore Jobs
// //               </NavLink>
// //             </li>
// //           </ul>

// //           {/* Authentication actions */}
// //           <div className="d-flex flex-column flex-lg-row align-items-stretch align-items-lg-center gap-2 mt-3 mt-lg-0">
// //             {isAuthenticated && user ? (
// //               <>
// //                 <NavLink
// //                   to={dashboardPath}
// //                   className="btn btn-light fw-semibold px-3"
// //                 >
// //                   <i className="bi bi-grid me-2" />
// //                   Dashboard
// //                 </NavLink>

// //                 <button
// //                   type="button"
// //                   className="btn btn-outline-danger fw-semibold px-3"
// //                   onClick={handleLogout}
// //                   disabled={isLoading}
// //                 >
// //                   <i className="bi bi-box-arrow-right me-2" />
// //                   {isLoading ? "Logging out..." : "Logout"}
// //                 </button>
// //               </>
// //             ) : (
// //               <>
// //                 <NavLink
// //                   to="/login"
// //                   className="btn btn-light fw-semibold px-3"
// //                 >
// //                   Login
// //                 </NavLink>

// //                 <NavLink
// //                   to="/register/applicant"
// //                   className="btn btn-primary fw-semibold px-3"
// //                 >
// //                   Get Started
// //                   <i className="bi bi-arrow-right ms-2" />
// //                 </NavLink>
// //               </>
// //             )}
// //           </div>
// //         </div>
// //       </div>
// //     </nav>
// //   );
// // }

// // export default PublicNavbar;
// // ------------------------------------------------------------

// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   NavLink,
//   useLocation,
//   useNavigate,
// } from "react-router-dom";

// import { logoutThunk } from "../../features/auth/authThunks";
// import { getDashboardPath } from "../../utils/auth.utils";

// function PublicNavbar() {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const location = useLocation();

//   const { user, isAuthenticated, isLoading } = useSelector(
//     (state) => state.auth
//   );

//   const [isMenuOpen, setIsMenuOpen] = useState(false);

//   const dashboardPath = getDashboardPath(user?.role);

//   const isRecruiter = user?.role === "RECRUITER";

//   const userName = user?.name?.trim() || "User";
//   const userInitial = userName.charAt(0).toUpperCase();

//   // Close the mobile menu when the route changes.
//   useEffect(() => {
//     const frameId = requestAnimationFrame(() => {
//       setIsMenuOpen(false);
//     });

//     return () => {
//       cancelAnimationFrame(frameId);
//     };
//   }, [location.pathname]);

//   const handleLogout = async () => {
//     await dispatch(logoutThunk());
//     setIsMenuOpen(false);
//     navigate("/", { replace: true });
//   };

//   const getNavLinkClass = ({ isActive }) =>
//     `th-public-nav-link ${isActive ? "active" : ""}`;

//   return (
//     <nav className="th-public-navbar">
//       <div className="container">
//         <div className="th-public-navbar-inner">
//           {/* Brand */}
//           <NavLink
//             to="/"
//             end
//             className="th-public-brand"
//             onClick={() => setIsMenuOpen(false)}
//           >
//             <span className="th-public-brand-mark">T</span>

//             <span className="th-public-brand-name">
//               TalentHub
//               <span className="th-public-brand-dot">.</span>
//             </span>
//           </NavLink>

//           {/* Desktop navigation */}
//           <div className="th-public-nav-center">
//             <NavLink
//               to="/"
//               end
//               className={getNavLinkClass}
//             >
//               Home
//             </NavLink>

//             <NavLink
//               to="/jobs"
//               className={getNavLinkClass}
//             >
//               Explore Jobs
//             </NavLink>
//           </div>

//           {/* Desktop authentication actions */}
//           <div className="th-public-actions">
//             {isAuthenticated && user ? (
//               <>
//                 <div className="th-public-account">
//                   <div className="th-public-account-avatar">
//                     {userInitial}
//                   </div>

//                   <div className="th-public-account-info">
//                     <span className="th-public-account-name">
//                       {userName}
//                     </span>

//                     <span className="th-public-account-role">
//                       {isRecruiter ? "Recruiter" : "Applicant"}
//                     </span>
//                   </div>
//                 </div>

//                 <NavLink
//                   to={dashboardPath}
//                   className="th-public-dashboard-btn"
//                 >
//                   <i className="bi bi-grid-1x2" />
//                   Dashboard
//                 </NavLink>

//                 <button
//                   type="button"
//                   className="th-public-logout-btn"
//                   onClick={handleLogout}
//                   disabled={isLoading}
//                   title="Logout"
//                 >
//                   <i className="bi bi-box-arrow-right" />
//                 </button>
//               </>
//             ) : (
//               <>
//                 <NavLink
//                   to="/login"
//                   className="th-public-login-btn"
//                 >
//                   Log in
//                 </NavLink>

//                 <NavLink
//                   to="/register/applicant"
//                   className="th-public-start-btn"
//                 >
//                   Get Started
//                   <i className="bi bi-arrow-up-right" />
//                 </NavLink>
//               </>
//             )}
//           </div>

//           {/* Mobile menu button */}
//           <button
//             type="button"
//             className="th-public-mobile-toggle"
//             onClick={() => setIsMenuOpen((previous) => !previous)}
//             aria-label={isMenuOpen ? "Close menu" : "Open menu"}
//             aria-expanded={isMenuOpen}
//           >
//             <i
//               className={`bi ${
//                 isMenuOpen ? "bi-x-lg" : "bi-list"
//               }`}
//             />
//           </button>
//         </div>

//         {/* Mobile navigation */}
//         <div
//           className={`th-public-mobile-menu ${
//             isMenuOpen ? "is-open" : ""
//           }`}
//         >
//           <div className="th-public-mobile-nav">
//             <NavLink
//               to="/"
//               end
//               className={getNavLinkClass}
//               onClick={() => setIsMenuOpen(false)}
//             >
//               <i className="bi bi-house-door" />
//               Home
//             </NavLink>

//             <NavLink
//               to="/jobs"
//               className={getNavLinkClass}
//               onClick={() => setIsMenuOpen(false)}
//             >
//               <i className="bi bi-search" />
//               Explore Jobs
//             </NavLink>
//           </div>

//           <div className="th-public-mobile-actions">
//             {isAuthenticated && user ? (
//               <>
//                 <div className="th-public-mobile-account">
//                   <div className="th-public-account-avatar">
//                     {userInitial}
//                   </div>

//                   <div className="th-public-account-info">
//                     <span className="th-public-account-name">
//                       {userName}
//                     </span>

//                     <span className="th-public-account-role">
//                       {isRecruiter ? "Recruiter" : "Applicant"}
//                     </span>
//                   </div>
//                 </div>

//                 <NavLink
//                   to={dashboardPath}
//                   className="th-public-start-btn th-mobile-action-btn"
//                   onClick={() => setIsMenuOpen(false)}
//                 >
//                   <i className="bi bi-grid-1x2" />
//                   Go to Dashboard
//                 </NavLink>

//                 <button
//                   type="button"
//                   className="th-public-mobile-logout"
//                   onClick={handleLogout}
//                   disabled={isLoading}
//                 >
//                   <i className="bi bi-box-arrow-right" />
//                   {isLoading ? "Logging out..." : "Logout"}
//                 </button>
//               </>
//             ) : (
//               <>
//                 <NavLink
//                   to="/login"
//                   className="th-public-mobile-login"
//                   onClick={() => setIsMenuOpen(false)}
//                 >
//                   Log in
//                 </NavLink>

//                 <NavLink
//                   to="/register/applicant"
//                   className="th-public-start-btn th-mobile-action-btn"
//                   onClick={() => setIsMenuOpen(false)}
//                 >
//                   Get Started
//                   <i className="bi bi-arrow-right" />
//                 </NavLink>
//               </>
//             )}
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// }

// export default PublicNavbar;
// ------------------------------------------------

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  NavLink,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { logoutThunk } from "../../features/auth/authThunks";
import { getDashboardPath } from "../../utils/auth.utils";

function PublicNavbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { user, isAuthenticated, isLoading } = useSelector(
    (state) => state.auth
  );

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const dashboardPath = getDashboardPath(user?.role);
  const isRecruiter = user?.role === "RECRUITER";

  const userName = user?.name?.trim() || "User";
  const userInitial = userName.charAt(0).toUpperCase();

  // Close the mobile menu after route changes.
  useEffect(() => {
    const frameId = requestAnimationFrame(() => {
      setIsMenuOpen(false);
    });

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [location.pathname]);

  const handleLogout = async () => {
    await dispatch(logoutThunk());
    setIsMenuOpen(false);
    navigate("/", { replace: true });
  };

  const getNavLinkClass = ({ isActive }) =>
    `th-public-nav-link ${isActive ? "active" : ""}`;

  return (
    <nav className="th-public-navbar">
      <div className="container">
        <div className="th-public-navbar-inner">
          {/* Brand */}
          <NavLink
            to="/"
            end
            className="th-public-brand"
            onClick={() => setIsMenuOpen(false)}
          >
            <span className="th-public-brand-mark">T</span>

            <span className="th-public-brand-name">
              TalentHub<span>.</span>
            </span>
          </NavLink>

          {/* Desktop navigation */}
          <div className="th-public-nav-center">
            <NavLink
              to="/"
              end
              className={getNavLinkClass}
            >
              Home
            </NavLink>

            <NavLink
              to="/jobs"
              className={getNavLinkClass}
            >
              Explore Jobs
            </NavLink>
          </div>

          {/* Desktop authentication actions */}
          <div className="th-public-actions">
            {isAuthenticated && user ? (
              <>
                <div className="th-public-account">
                  <div className="th-public-account-avatar">
                    {userInitial}
                  </div>

                  <div className="th-public-account-details">
                    <span className="th-public-account-name">
                      {userName}
                    </span>

                    <span className="th-public-account-role">
                      {isRecruiter ? "Recruiter" : "Applicant"}
                    </span>
                  </div>
                </div>

                <NavLink
                  to={dashboardPath}
                  className="th-public-dashboard-btn"
                >
                  <i className="bi bi-grid-1x2" />
                  Dashboard
                </NavLink>

                <button
                  type="button"
                  className="th-public-logout-btn"
                  onClick={handleLogout}
                  disabled={isLoading}
                  title="Logout"
                  aria-label="Logout"
                >
                  <i className="bi bi-box-arrow-right" />
                </button>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className="th-public-login-btn"
                >
                  Login
                </NavLink>

                <NavLink
                  to="/register/applicant"
                  className="th-public-start-btn"
                >
                  Get Started
                  <i className="bi bi-arrow-up-right" />
                </NavLink>
              </>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            type="button"
            className="th-public-menu-button"
            onClick={() => setIsMenuOpen((previous) => !previous)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
          >
            <i
              className={`bi ${
                isMenuOpen ? "bi-x-lg" : "bi-list"
              }`}
            />
          </button>
        </div>

        {/* Mobile navigation */}
        <div
          className={`th-public-mobile-menu ${
            isMenuOpen ? "th-public-mobile-menu-open" : ""
          }`}
        >
          <div className="th-public-mobile-nav">
            <NavLink
              to="/"
              end
              className={getNavLinkClass}
              onClick={() => setIsMenuOpen(false)}
            >
              <i className="bi bi-house-door" />
              Home
            </NavLink>

            <NavLink
              to="/jobs"
              className={getNavLinkClass}
              onClick={() => setIsMenuOpen(false)}
            >
              <i className="bi bi-search" />
              Explore Jobs
            </NavLink>
          </div>

          <div className="th-public-mobile-actions">
            {isAuthenticated && user ? (
              <>
                <div className="th-public-mobile-account">
                  <div className="th-public-account-avatar">
                    {userInitial}
                  </div>

                  <div className="th-public-account-details">
                    <span className="th-public-account-name">
                      {userName}
                    </span>

                    <span className="th-public-account-role">
                      {isRecruiter ? "Recruiter" : "Applicant"}
                    </span>
                  </div>
                </div>

                <NavLink
                  to={dashboardPath}
                  className="th-public-start-btn th-public-mobile-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <i className="bi bi-grid-1x2" />
                  Dashboard
                </NavLink>

                <button
                  type="button"
                  className="th-public-mobile-logout"
                  onClick={handleLogout}
                  disabled={isLoading}
                >
                  <i className="bi bi-box-arrow-right" />
                  {isLoading ? "Logging out..." : "Logout"}
                </button>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className="th-public-mobile-login"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </NavLink>

                <NavLink
                  to="/register/applicant"
                  className="th-public-start-btn th-public-mobile-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Get Started
                  <i className="bi bi-arrow-right" />
                </NavLink>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default PublicNavbar;
