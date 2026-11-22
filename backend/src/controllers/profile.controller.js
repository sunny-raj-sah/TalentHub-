
import {
  applicantProfileSchema,
  recruiterProfileSchema,
} from "../validators/profile.validator.js";

import {
  getMyProfile,
  updateMyProfile,
    getPublicProfile,
} from "../services/profile.service.js";

export const getProfile = async (req, res, next) => {
  try {
    const result = await getMyProfile(req.user.id, req.user.role);

    return res.status(200).json({
      success: true,
      message: "Profile fetched successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const schema =
      req.user.role === "APPLICANT"
        ? applicantProfileSchema
        : recruiterProfileSchema;

    const validation = schema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validation.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
    }

    const result = await updateMyProfile(
      req.user.id,
      req.user.role,
      validation.data
    );

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};


export const getUserPublicProfile = async (req, res, next) => {
  try {
    const result = await getPublicProfile(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Public profile fetched successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
