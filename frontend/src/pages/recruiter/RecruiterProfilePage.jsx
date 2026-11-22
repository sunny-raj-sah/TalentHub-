
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

import RecruiterProfileHeader from "../../components/recruiter/RecruiterProfileHeader";
import RecruiterCompanyInfo from "../../components/recruiter/RecruiterCompanyInfo";

function RecruiterProfilePage() {
  const dispatch = useDispatch();

  const {
    // user,
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

        <p className="text-muted mt-3">
          Loading your company profile...
        </p>
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
        <h2 className="fw-bold mb-1">Company Profile</h2>

        <p className="text-muted mb-0">
          Manage your company identity and introduce your organization to potential applicants.
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

      <div className="d-flex flex-column gap-4">
        <RecruiterProfileHeader
        //   user={user}
          profile={profile}
        />

        <RecruiterCompanyInfo
          profile={profile}
          onSave={handleSave}
          isUpdating={isUpdating}
        />
      </div>
    </div>
  );
}

export default RecruiterProfilePage;
