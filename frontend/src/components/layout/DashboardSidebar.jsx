 
// import { useDispatch, useSelector } from "react-redux";
// import { NavLink, useNavigate } from "react-router-dom";

// import { logoutThunk } from "../../features/auth/authThunks";
// import { getDashboardPath } from "../../utils/auth.utils";

// const applicantLinks = [
//   {
//     label: "Overview",
//     path: "/applicant/dashboard",
//     icon: "bi-grid-1x2",
//     end: true,
//   },
//   {
//     label: "Explore Jobs",
//     path: "/jobs",
//     icon: "bi-search",
//   },
//   {
//     label: "My Applications",
//     path: "/applicant/applications",
//     icon: "bi-file-earmark-text",
//   },
//   {
//     label: "Saved Jobs",
//     path: "/applicant/bookmarks",
//     icon: "bi-bookmark",
//   },
//   {
//     label: "AI Interview Prep",
//     path: "/applicant/interview-preparation",
//     icon: "bi-stars",
//   },
//   {
//     label: "My Profile",
//     path: "/applicant/profile",
//     icon: "bi-person",
//   },
// ];

// const recruiterLinks = [
//   {
//     label: "Overview",
//     path: "/recruiter/dashboard",
//     icon: "bi-grid-1x2",
//     end: true,
//   },
//   {
//     label: "My Jobs",
//     path: "/recruiter/jobs",
//     icon: "bi-briefcase",
//   },
//   {
//     label: "Post a Job",
//     path: "/recruiter/jobs/new",
//     icon: "bi-plus-square",
//   },
//   {
//     label: "AI Hiring Assistant",
//     path: "/recruiter/hiring-assistant",
//     icon: "bi-stars",
//   },
//   {
//     label: "My Profile",
//     path: "/recruiter/profile",
//     icon: "bi-person",
//   },
// ];

// function DashboardSidebar({
//   role,
//   user,
//   isCollapsed,
//   setIsCollapsed,
//   isMobileOpen,
//   setIsMobileOpen,
// }) {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const isLoading = useSelector((state) => state.auth.isLoading);

//   const isRecruiter = role === "RECRUITER";
//   const links = isRecruiter ? recruiterLinks : applicantLinks;

//   const dashboardPath = getDashboardPath(role);

//   const handleSidebarControl = () => {
//     const isMobile = window.matchMedia("(max-width: 768px)").matches;

//     if (isMobile) {
//       setIsMobileOpen(false);
//       return;
//     }

//     setIsCollapsed((previous) => !previous);
//   };

//   const handleNavigation = () => {
//     setIsMobileOpen(false);
//   };

//   const handleLogout = async () => {
//     try {
//       await dispatch(logoutThunk()).unwrap();
//       setIsMobileOpen(false);
//       navigate("/", { replace: true });
//     } catch (error) {
//       console.error("Logout failed:", error);
//     }
//   };

//   return (
//     <aside
//       id="th-dashboard-sidebar"
//       className={`th-sidebar ${
//         isCollapsed ? "th-sidebar-collapsed" : ""
//       } ${isMobileOpen ? "th-sidebar-mobile-open" : ""}`}
//       aria-label={`${isRecruiter ? "Recruiter" : "Applicant"} navigation`}
//     >
//       {/* Brand and sidebar control */}
//       <div className="th-sidebar-brand">
//         <NavLink
//           to={dashboardPath}
//           className="th-brand-link"
//           aria-label="TalentHub dashboard"
//           onClick={handleNavigation}
//         >
//           <span className="th-brand-mark">
//             <i className="bi bi-layers-half" aria-hidden="true" />
//           </span>

//           <span className="th-brand-name">
//             Talent<span>Hub</span>
//           </span>
//         </NavLink>

//         <button
//           type="button"
//           className="th-sidebar-collapse-button"
//           title={
//             isMobileOpen
//               ? "Close navigation"
//               : isCollapsed
//                 ? "Expand sidebar"
//                 : "Collapse sidebar"
//           }
//           aria-label={
//             isMobileOpen
//               ? "Close navigation"
//               : isCollapsed
//                 ? "Expand sidebar"
//                 : "Collapse sidebar"
//           }
//           aria-controls="th-dashboard-sidebar"
//           aria-expanded={isMobileOpen || !isCollapsed}
//           onClick={handleSidebarControl}
//         >
//           <i
//             className={`bi ${
//               isMobileOpen
//                 ? "bi-x-lg"
//                 : isCollapsed
//                   ? "bi-chevron-bar-right"
//                   : "bi-chevron-bar-left"
//             }`}
//             aria-hidden="true"
//           />
//         </button>
//       </div>

//       {/* Workspace label */}
//       <div className="th-sidebar-section-label">
//         <span>WORKSPACE</span>
//       </div>

//       {/* Navigation */}
//       <nav className="th-sidebar-nav" aria-label="Workspace navigation">
//         {links.map((link) => (
//           <NavLink
//             key={link.path}
//             to={link.path}
//             end={link.end}
//             title={isCollapsed ? link.label : undefined}
//             onClick={handleNavigation}
//             className={({ isActive }) =>
//               `th-nav-link ${isActive ? "active" : ""} ${
//                 link.label.includes("AI") ? "th-ai-link" : ""
//               }`
//             }
//           >
//             <span className="th-nav-icon">
//               <i className={`bi ${link.icon}`} aria-hidden="true" />
//             </span>

//             <span className="th-nav-label">{link.label}</span>

//             {link.label.includes("AI") && (
//               <span className="th-ai-indicator" aria-hidden="true" />
//             )}

//             <span className="th-nav-active-line" aria-hidden="true" />
//           </NavLink>
//         ))}
//       </nav>

//       {/* Bottom section */}
//       <div className="th-sidebar-bottom">
//         <div className="th-sidebar-divider" />

//         <div className="th-sidebar-account">
//           <div className="th-account-avatar">
//             {user?.name?.trim()?.charAt(0)?.toUpperCase() || "U"}
//           </div>

//           <div className="th-account-details">
//             <div className="th-account-name">
//               {user?.name || "TalentHub User"}
//             </div>

//             <div className="th-account-role">
//               {isRecruiter ? "Recruiter account" : "Applicant account"}
//             </div>
//           </div>

//           <span className="th-account-status" title="Account status" />
//         </div>

//         <button
//           type="button"
//           className="th-logout-button"
//           onClick={handleLogout}
//           disabled={isLoading}
//           title={isCollapsed ? "Logout" : undefined}
//         >
//           <i className="bi bi-box-arrow-left" aria-hidden="true" />
//           <span>{isLoading ? "Logging out..." : "Sign out"}</span>
//         </button>

//         <div className="th-sidebar-footer">
//           <span className="th-footer-dot" />
//           TalentHub Workspace
//           <span className="ms-auto">v1.0</span>
//         </div>
//       </div>
//     </aside>
//   );
// }

// export default DashboardSidebar;
// -----------------------------------------------------------
 import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";

import { logoutThunk } from "../../features/auth/authThunks";
import { getDashboardPath } from "../../utils/auth.utils";

const applicantLinks = [
  {
    label: "Overview",
    path: "/applicant/dashboard",
    icon: "bi-grid-1x2",
    end: true,
  },
  {
    label: "Explore Jobs",
    path: "/jobs",
    icon: "bi-search",
  },
  {
    label: "My Applications",
    path: "/applicant/applications",
    icon: "bi-file-earmark-text",
  },
  {
    label: "Saved Jobs",
    path: "/applicant/bookmarks",
    icon: "bi-bookmark",
  },
  {
    label: "AI Interview Prep",
    path: "/applicant/interview-preparation",
    icon: "bi-stars",
  },
  {
    label: "My Profile",
    path: "/applicant/profile",
    icon: "bi-person",
  },
];

const recruiterLinks = [
  {
    label: "Overview",
    path: "/recruiter/dashboard",
    icon: "bi-grid-1x2",
    end: true,
  },
 
  {
    label: "My Jobs",
    path: "/recruiter/jobs",
    icon: "bi-briefcase",
  },
  {
    label: "Explore Jobs",
    path: "/jobs",
    icon: "bi-search",
  },
  {
    label: "Post a Job",
    path: "/recruiter/jobs/new",
    icon: "bi-plus-square",
  },

  {
    label: "AI Hiring Assistant",
    path: "/recruiter/hiring-assistant",
    icon: "bi-stars",
  },
  {
    label: "My Profile",
    path: "/recruiter/profile",
    icon: "bi-person",
  },
];

function DashboardSidebar({
  role,
  user,
  isCollapsed,
  setIsCollapsed,
  isMobileOpen,
  setIsMobileOpen,
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isLoading = useSelector((state) => state.auth.isLoading);

  const isRecruiter = role === "RECRUITER";
  const links = isRecruiter ? recruiterLinks : applicantLinks;

  const dashboardPath = getDashboardPath(role);

  const handleSidebarControl = () => {
    const isMobile = window.matchMedia("(max-width: 768px)").matches;

    if (isMobile) {
      setIsMobileOpen(false);
      return;
    }

    setIsCollapsed((previous) => !previous);
  };

  const handleNavigation = () => {
    setIsMobileOpen(false);
  };

  const handleLogout = async () => {
    try {
      await dispatch(logoutThunk()).unwrap();
      setIsMobileOpen(false);
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const controlLabel = isMobileOpen
    ? "Close navigation"
    : isCollapsed
      ? "Expand sidebar"
      : "Collapse sidebar";

  return (
    <aside
      id="th-dashboard-sidebar"
      className={`th-sidebar ${
        isCollapsed ? "th-sidebar-collapsed" : ""
      } ${isMobileOpen ? "th-sidebar-mobile-open" : ""}`}
      aria-label={`${isRecruiter ? "Recruiter" : "Applicant"} navigation`}
    >
      {/* Brand + collapse control */}
      <div className="th-sidebar-brand">
        <NavLink
          to={dashboardPath}
          className="th-brand-link"
          aria-label="TalentHub dashboard"
          onClick={handleNavigation}
        >
          <span className="th-brand-mark">
            <i className="bi bi-layers-half" aria-hidden="true" />
          </span>

          <span className="th-brand-name">
            Talent<span>Hub</span>
          </span>
        </NavLink>

        <button
          type="button"
          className="th-sidebar-collapse-button"
          title={controlLabel}
          aria-label={controlLabel}
          aria-controls="th-dashboard-sidebar"
          aria-expanded={isMobileOpen || !isCollapsed}
          onClick={handleSidebarControl}
        >
          <i
            className={`bi ${
              isMobileOpen
                ? "bi-x-lg"
                : isCollapsed
                  ? "bi-chevron-bar-right"
                  : "bi-chevron-bar-left"
            }`}
            aria-hidden="true"
          />
        </button>
      </div>

      {/* Workspace label */}
      <div className="th-sidebar-section-label">
        <span className="th-sidebar-section-title">WORKSPACE</span>
      </div>

      {/* Navigation */}
      <nav className="th-sidebar-nav" aria-label="Workspace navigation">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            end={link.end}
            title={isCollapsed ? link.label : undefined}
            onClick={handleNavigation}
            className={({ isActive }) =>
              `th-nav-link ${isActive ? "active" : ""} ${
                link.label.includes("AI") ? "th-ai-link" : ""
              }`
            }
          >
            <span className="th-nav-icon">
              <i className={`bi ${link.icon}`} aria-hidden="true" />
            </span>

            <span className="th-nav-label">{link.label}</span>

            {link.label.includes("AI") && (
              <span className="th-ai-indicator" aria-hidden="true" />
            )}

            <span className="th-nav-active-line" aria-hidden="true" />
          </NavLink>
        ))}
      </nav>

      {/* Bottom section */}
      <div className="th-sidebar-bottom">
        <div className="th-sidebar-divider" />

        {/* Account */}
        <div className="th-sidebar-account">
          <div className="th-account-avatar">
            {user?.name?.trim()?.charAt(0)?.toUpperCase() || "U"}
          </div>

          <div className="th-account-details">
            <div className="th-account-name">
              {user?.name || "TalentHub User"}
            </div>

            <div className="th-account-role">
              {isRecruiter ? "Recruiter account" : "Applicant account"}
            </div>
          </div>

          <span className="th-account-status" title="Account status" />
        </div>

        {/* Logout */}
        <button
          type="button"
          className="th-logout-button"
          onClick={handleLogout}
          disabled={isLoading}
          title={isCollapsed ? "Logout" : undefined}
        >
          <i className="bi bi-box-arrow-left" aria-hidden="true" />
          <span>{isLoading ? "Logging out..." : "Sign out"}</span>
        </button>

        {/* Footer */}
        <div className="th-sidebar-footer">
          <span className="th-footer-dot" />
          TalentHub Workspace
          <span className="ms-auto">v1.0</span>
        </div>
      </div>
    </aside>
  );
}

export default DashboardSidebar;