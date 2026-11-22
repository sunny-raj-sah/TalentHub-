
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchMyProfileThunk,
  updateMyProfileThunk,
} from "../../features/profile/profileThunks";

import {
  clearProfileError,
  clearProfileFeedback,
} from "../../features/profile/profileSlice";

import ApplicantProfileHeader from "../../components/applicant/ApplicantProfileHeader";
import ApplicantPersonalInfo from "../../components/applicant/ApplicantPersonalInfo";
import ApplicantSkills from "../../components/applicant/ApplicantSkills";
import ApplicantExperience from "../../components/applicant/ApplicantExperience";
import ApplicantEducation from "../../components/applicant/ApplicantEducation";
import ApplicantResume from "../../components/applicant/ApplicantResume";

function ApplicantProfilePage() {
  const dispatch = useDispatch();

  const {
    user,
    profile,
    isLoading,
    isUpdating,
    error,
    updateError,
    updateSuccess,
  } = useSelector((state) => state.profile);

  useEffect(() => {
    dispatch(fetchMyProfileThunk());

    return () => {
      dispatch(clearProfileError());
      dispatch(clearProfileFeedback());
    };
  }, [dispatch]);

  const handleSave = (profileData) => {
    dispatch(updateMyProfileThunk(profileData));
  };

  if (isLoading && !profile) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="text-muted mt-3">Loading your profile...</p>
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">
          {error}
          <button
            type="button"
            className="btn btn-sm btn-outline-danger ms-3"
            onClick={() => dispatch(fetchMyProfileThunk())}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="mb-4">
        <h2 className="fw-bold mb-1">My Profile</h2>
        <p className="text-muted mb-0">
          Manage your personal information, skills, experience, and education.
        </p>
      </div>

      {updateSuccess && (
        <div className="alert alert-success alert-dismissible fade show">
          {updateSuccess}
          <button
            type="button"
            className="btn-close"
            onClick={() => dispatch(clearProfileFeedback())}
            aria-label="Close"
          />
        </div>
      )}

      {updateError && (
        <div className="alert alert-danger alert-dismissible fade show">
          {updateError}
          <button
            type="button"
            className="btn-close"
            onClick={() => dispatch(clearProfileFeedback())}
            aria-label="Close"
          />
        </div>
      )}

      <div className="mb-4">
        <ApplicantProfileHeader user={user} profile={profile} />
      </div>

      <div className="d-flex flex-column gap-4">
        <ApplicantPersonalInfo
          user={user}
          profile={profile}
          onSave={handleSave}
          isUpdating={isUpdating}
        />
<ApplicantResume user={user} profile={profile} />
        <ApplicantSkills
          profile={profile}
          onSave={handleSave}
          isUpdating={isUpdating}
        />

        <ApplicantExperience
          profile={profile}
          onSave={handleSave}
          isUpdating={isUpdating}
        />

        <ApplicantEducation
          profile={profile}
          onSave={handleSave}
          isUpdating={isUpdating}
        />
      </div>
    </div>
  );
}

export default ApplicantProfilePage;
