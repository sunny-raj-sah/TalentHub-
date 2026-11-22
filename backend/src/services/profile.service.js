 

import User from "../models/User.js";
import ApplicantProfile from "../models/ApplicantProfile.js";
import RecruiterProfile from "../models/RecruiterProfile.js";

const getProfileModel = (role) => {
  if (role === "APPLICANT") return ApplicantProfile;
  if (role === "RECRUITER") return RecruiterProfile;

  const error = new Error("Invalid user role");
  error.statusCode = 403;
  throw error;
};

// Remove private resume information from profile responses.
const sanitizeProfile = (profile, role) => {
  const profileData = profile.toObject();

  const resume = {
    hasResume: Boolean(
      profileData.resumePublicId || profileData.resumeUrl
    ),
    originalName: profileData.resumeOriginalName || "",
    mimeType: profileData.resumeMimeType || "",
    size: profileData.resumeSize || 0,
  };

  delete profileData.resumeUrl;
  delete profileData.resumePublicId;
  delete profileData.resumeOriginalName;
  delete profileData.resumeMimeType;
  delete profileData.resumeSize;

  return {
    ...profileData,
    ...(role === "APPLICANT" ? { resume } : {}),
  };
};

// Get the logged-in user's profile.
export const getMyProfile = async (userId, role) => {
  const Profile = getProfileModel(role);

  const [user, profile] = await Promise.all([
    User.findById(userId).select("name email role"),
    Profile.findOne({ user: userId }),
  ]);

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  if (!profile) {
    const error = new Error("Profile not found");
    error.statusCode = 404;
    throw error;
  }

  return {
    user,
    profile: sanitizeProfile(profile, role),
  };
};

// Update the logged-in user's profile.
export const updateMyProfile = async (userId, role, profileData) => {
  const Profile = getProfileModel(role);

  const { name, ...profileFields } = profileData;

  if (name !== undefined) {
    await User.findByIdAndUpdate(
      userId,
      { $set: { name } },
      { new: true, runValidators: true }
    );
  }

  const profile = await Profile.findOneAndUpdate(
    { user: userId },
    { $set: profileFields },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!profile) {
    const error = new Error("Profile not found");
    error.statusCode = 404;
    throw error;
  }

  const user = await User.findById(userId).select("name email role");

  return {
    user,
    profile: sanitizeProfile(profile, role),
  };
};

// Get another user's public profile.
export const getPublicProfile = async (profileUserId) => {
  const user = await User.findById(profileUserId).select(
    "name role createdAt"
  );

  if (!user || !user.isActive) {
    const error = new Error("User profile not found");
    error.statusCode = 404;
    throw error;
  }

  const Profile = getProfileModel(user.role);

  const profile = await Profile.findOne({
    user: profileUserId,
  }).select("-_id -user -__v -createdAt -updatedAt");

  if (!profile) {
    const error = new Error("User profile not found");
    error.statusCode = 404;
    throw error;
  }

  return {
    user: {
      id: user._id.toString(),
      name: user.name,
      role: user.role,
    },
    profile: sanitizeProfile(profile, user.role),
  };
};
