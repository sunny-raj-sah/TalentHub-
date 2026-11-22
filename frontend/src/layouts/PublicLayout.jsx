 
import { NavLink, Outlet } from "react-router-dom";

import PublicNavbar from "../components/layout/PublicNavbar";

import "../styles/public-layout.css";

function PublicLayout() {
  return (
    <div className="th-public-layout">
      <PublicNavbar />

      <main className="th-public-main">
        <Outlet />
      </main>

      <footer className="th-public-footer">
        <div className="container">
          <div className="row gy-4">
            {/* Brand */}
            <div className="col-lg-5 col-md-6">
              <NavLink to="/" className="th-footer-brand">
                <span className="th-footer-brand-mark">T</span>

                <span className="th-footer-brand-name">
                  TalentHub<span>.</span>
                </span>
              </NavLink>

              <p className="th-footer-description">
                Connecting great talent with great opportunities.
                Build your career or discover the people who will
                shape your company's future.
              </p>
            </div>

            {/* Explore */}
            <div className="col-lg-2 col-md-6">
              <h6 className="th-footer-heading">Explore</h6>

              <div className="th-footer-links">
                <NavLink to="/" end className="th-footer-link">
                  Home
                </NavLink>

                <NavLink to="/jobs" className="th-footer-link">
                  Explore Jobs
                </NavLink>
              </div>
            </div>

            {/* Account */}
            <div className="col-lg-2 col-md-6">
              <h6 className="th-footer-heading">Get Started</h6>

              <div className="th-footer-links">
                <NavLink to="/login" className="th-footer-link">
                  Login
                </NavLink>

                <NavLink
                  to="/register/applicant"
                  className="th-footer-link"
                >
                  Join as Applicant
                </NavLink>

                <NavLink
                  to="/register/recruiter"
                  className="th-footer-link"
                >
                  Join as Recruiter
                </NavLink>
              </div>
            </div>

            {/* Platform information */}
            <div className="col-lg-3 col-md-6">
              <h6 className="th-footer-heading">Our Platform</h6>

              <p className="th-footer-platform-text">
                One platform for discovering opportunities,
                managing applications, and finding exceptional talent.
              </p>

              <div className="th-footer-platform-badge">
                <span className="th-footer-dot" />
                Built for better hiring
              </div>
            </div>
          </div>

          <div className="th-footer-divider" />

          <div className="th-footer-bottom">
            <p className="mb-0">
              © {new Date().getFullYear()} TalentHub. All rights reserved.
            </p>

            <p className="mb-0">
              Connecting talent with opportunity.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default PublicLayout;
