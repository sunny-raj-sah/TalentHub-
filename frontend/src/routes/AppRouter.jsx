import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";
import GuestRoute from "./GuestRoute";

import DashboardLayout from "../layouts/DashboardLayout";


import PublicLayout from "../layouts/PublicLayout";
import HomePage from "../pages/public/HomePage";
import JobsPage from "../pages/public/JobsPage";
import JobDetailsPage from "../pages/public/JobDetailsPage";

import ApplicationsPage from "../pages/applicant/ApplicationsPage";

import ApplicationDetailsPage from "../pages/applicant/ApplicationDetailsPage";

import LoginPage from "../pages/auth/LoginPage";
import ApplicantRegistrationPage from "../pages/auth/ApplicantRegistrationPage";
import RecruiterRegistrationPage from "../pages/auth/RecruiterRegistrationPage";
import ApplicantDashboardPage from "../pages/applicant/ApplicantDashboardPage";
import BookmarkedJobsPage from "../pages/applicant/BookmarkedJobsPage";
import ApplicantProfilePage from "../pages/applicant/ApplicantProfilePage";

import RecruiterDashboardPage from "../pages/recruiter/RecruiterDashboardPage";
import RecruiterJobsPage from "../pages/recruiter/RecruiterJobsPage";
import PostJobPage from "../pages/recruiter/PostJobPage.jsx";
import EditJobPage from "../pages/recruiter/EditJobPage";

import RecruiterJobApplicationsPage from "../pages/recruiter/RecruiterJobApplicationsPage";

import RecruiterProfilePage from "../pages/recruiter/RecruiterProfilePage";

import InterviewPreparationPage from "../pages/applicant/InterviewPreparationPage";
import HiringAssistantPage from "../pages/recruiter/HiringAssistantPage";

function RoutePlaceholder({ title }) {
  return (
    <main className="container py-5">
      <h2 className="fw-bold">{title}</h2>

      <p className="text-secondary">
        This TalentHub page will be implemented in its respective phase.
      </p>
    </main>
  );
}

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />

          <Route path="/jobs" element={<JobsPage />} />
          <Route path="jobs/:jobId" element={<JobDetailsPage />} />
     

        {/* Guest-only routes */}
        <Route element={<GuestRoute />}>
          <Route path="/login" element={<LoginPage />} />

          <Route
            path="/register/applicant"
            element={<ApplicantRegistrationPage />}
          />

          <Route
            path="/register/recruiter"
            element={<RecruiterRegistrationPage />}
          />
             </Route>
        </Route>

        {/* Applicant-only routes */}
        <Route element={<ProtectedRoute allowedRoles={["APPLICANT"]} />}>
        <Route element={<DashboardLayout />}>
          <Route
            path="/applicant/dashboard"
            element={<ApplicantDashboardPage />}
          />

          <Route
            path="/applicant/applications"
            element={<ApplicationsPage />}
          />

          <Route
            path="/applicant/applications/:applicationId"
            element={<ApplicationDetailsPage />}
          />

          <Route path="/applicant/bookmarks" element={<BookmarkedJobsPage />} />

          <Route path="/applicant/profile" element={<ApplicantProfilePage />} />
          <Route
            path="/applicant/interview-preparation"
            element={<InterviewPreparationPage />}
          />
          </Route>
        </Route>

        {/* Recruiter-only routes */}
        <Route element={<ProtectedRoute allowedRoles={["RECRUITER"]} />}>
         <Route element={<DashboardLayout />}>
          <Route
            path="/recruiter/dashboard"
            element={<RecruiterDashboardPage />}
          />

          <Route path="/recruiter/jobs" element={<RecruiterJobsPage />} />

          <Route path="/recruiter/jobs/new" element={<PostJobPage />} />

          <Route path="/recruiter/jobs/:jobId/edit" element={<EditJobPage />} />

          <Route
            path="/recruiter/jobs/:jobId/applications"
            element={<RecruiterJobApplicationsPage />}
          />

          <Route path="/recruiter/profile" element={<RecruiterProfilePage />} />

          <Route
            path="/recruiter/hiring-assistant"
            element={<HiringAssistantPage />}
          />
          </Route>
        </Route>

        {/* Unknown routes */}
        <Route
          path="/404"
          element={<RoutePlaceholder title="Page Not Found" />}
        />

        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
