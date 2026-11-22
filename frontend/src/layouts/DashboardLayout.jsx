
// import { useEffect, useState } from "react";
// import { Outlet, useLocation } from "react-router-dom";
// import { useSelector } from "react-redux";

// import DashboardSidebar from "../components/layout/DashboardSidebar";

// import "../styles/dashboard-layout.css";

// const pageTitles = {
//   "/applicant/dashboard": "Dashboard",
//   "/applicant/applications": "My Applications",
//   "/applicant/bookmarks": "Saved Jobs",
//   "/applicant/profile": "My Profile",
//   "/applicant/interview-preparation": "AI Interview Preparation",

//   "/recruiter/dashboard": "Dashboard",
//   "/recruiter/jobs": "My Jobs",
//   "/recruiter/jobs/new": "Post a Job",
//   "/recruiter/profile": "My Profile",
//   "/recruiter/hiring-assistant": "AI Hiring Assistant",
// };

// function DashboardLayout() {
//   const location = useLocation();

//   const user = useSelector((state) => state.auth.user);

//   const [isCollapsed, setIsCollapsed] = useState(false);
//   const [isMobileOpen, setIsMobileOpen] = useState(false);

//   const role = user?.role;
//   const isRecruiter = role === "RECRUITER";

//   const pageTitle =
//     pageTitles[location.pathname] ||
//     (location.pathname.includes("/applications/")
//       ? "Application Details"
//       : location.pathname.includes("/edit")
//         ? "Edit Job"
//         : "TalentHub Workspace");

 
// useEffect(() => {
//   const frameId = requestAnimationFrame(() => {
//     setIsMobileOpen(false);
//   });

//   return () => {
//     cancelAnimationFrame(frameId);
//   };
// }, [location.pathname]);
//   useEffect(() => {
//     document.body.classList.toggle(
//       "th-sidebar-open",
//       isMobileOpen
//     );

//     return () => {
//       document.body.classList.remove("th-sidebar-open");
//     };
//   }, [isMobileOpen]);

//   return (
//     <div className="th-workspace">
//       <DashboardSidebar
//         role={role}
//         user={user}
//         isCollapsed={isCollapsed}
//         setIsCollapsed={setIsCollapsed}
//         isMobileOpen={isMobileOpen}
//         setIsMobileOpen={setIsMobileOpen}
//       />

//       {isMobileOpen && (
//         <button
//           type="button"
//           className="th-sidebar-backdrop"
//           aria-label="Close navigation"
//           onClick={() => setIsMobileOpen(false)}
//         />
//       )}

//       <div
//         className={`th-workspace-main ${
//           isCollapsed ? "th-main-collapsed" : ""
//         }`}
//       >
//         <header className="th-topbar">
//           <div className="d-flex align-items-center gap-3">
//             <button
//               type="button"
//               className="th-menu-button"
//               aria-label="Toggle navigation"
//               onClick={() => {
//                 if (window.innerWidth <= 768) {
//                   setIsMobileOpen((previous) => !previous);
//                 } else {
//                   setIsCollapsed((previous) => !previous);
//                 }
//               }}
//             >
//               <i className="bi bi-list" />
//             </button>

//             <div>
//               <div className="th-topbar-eyebrow">
//                 {isRecruiter ? "RECRUITER WORKSPACE" : "APPLICANT WORKSPACE"}
//               </div>
//               <h1 className="th-page-title">{pageTitle}</h1>
//             </div>
//           </div>

//           <div className="d-flex align-items-center gap-3">
//             <div className="th-role-chip">
//               <span className="th-status-dot" />
//               {isRecruiter ? "Recruiter" : "Applicant"}
//             </div>

//             <div className="th-topbar-avatar" title={user?.name || "Account"}>
//               {user?.name?.trim()?.charAt(0)?.toUpperCase() || "U"}
//             </div>
//           </div>
//         </header>

//         <main className="th-workspace-content">
//           <div className="th-content-enter" key={location.pathname}>
//             <Outlet />
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// }

// export default DashboardLayout;
// ------------------------------------------------
 
import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

import DashboardSidebar from "../components/layout/DashboardSidebar";

import "../styles/dashboard-layout.css";

const pageTitles = {
  "/applicant/dashboard": "Dashboard",
  "/applicant/applications": "My Applications",
  "/applicant/bookmarks": "Saved Jobs",
  "/applicant/profile": "My Profile",
  "/applicant/interview-preparation": "AI Interview Preparation",

  "/recruiter/dashboard": "Dashboard",
  "/recruiter/jobs": "My Jobs",
  "/recruiter/jobs/new": "Post a Job",
  "/recruiter/profile": "My Profile",
  "/recruiter/hiring-assistant": "AI Hiring Assistant",
};

function DashboardLayout() {
  const location = useLocation();

  const user = useSelector((state) => state.auth.user);

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const role = user?.role;
  const isRecruiter = role === "RECRUITER";

  const pageTitle =
    pageTitles[location.pathname] ||
    (location.pathname.includes("/applications/")
      ? "Application Details"
      : location.pathname.includes("/edit")
        ? "Edit Job"
        : "TalentHub Workspace");

  // Close mobile drawer after navigation.
  useEffect(() => {
    const frameId = requestAnimationFrame(() => {
      setIsMobileOpen(false);
    });

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [location.pathname]);

  // Prevent background scrolling while mobile drawer is open.
  useEffect(() => {
    document.body.classList.toggle("th-sidebar-open", isMobileOpen);

    return () => {
      document.body.classList.remove("th-sidebar-open");
    };
  }, [isMobileOpen]);

  // Close mobile drawer using Escape key.
  useEffect(() => {
    if (!isMobileOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsMobileOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMobileOpen]);

  return (
    <div className="th-workspace">
      <DashboardSidebar
        role={role}
        user={user}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {isMobileOpen && (
        <button
          type="button"
          className="th-sidebar-backdrop"
          aria-label="Close navigation"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <div
        className={`th-workspace-main ${
          isCollapsed ? "th-main-collapsed" : ""
        }`}
      >
        <header className="th-topbar">
          <div className="d-flex align-items-center gap-3">
            {/* Mobile navigation toggle */}
            <button
              type="button"
              className="th-menu-button"
              aria-label={isMobileOpen ? "Close navigation" : "Open navigation"}
              aria-controls="th-dashboard-sidebar"
              aria-expanded={isMobileOpen}
              onClick={() => setIsMobileOpen((previous) => !previous)}
            >
              <i
                className={`bi ${isMobileOpen ? "bi-x-lg" : "bi-list"}`}
                aria-hidden="true"
              />
            </button>

            <div>
              <div className="th-topbar-eyebrow">
                {isRecruiter ? "RECRUITER WORKSPACE" : "APPLICANT WORKSPACE"}
              </div>

              <h1 className="th-page-title">{pageTitle}</h1>
            </div>
          </div>

          <div className="d-flex align-items-center gap-3">
            <div className="th-role-chip">
              <span className="th-status-dot" />
              {isRecruiter ? "Recruiter" : "Applicant"}
            </div>

            <div
              className="th-topbar-avatar"
              title={user?.name || "Account"}
              aria-label={user?.name || "Account"}
            >
              {user?.name?.trim()?.charAt(0)?.toUpperCase() || "U"}
            </div>
          </div>
        </header>

        <main className="th-workspace-content">
          <div className="th-content-enter" key={location.pathname}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
