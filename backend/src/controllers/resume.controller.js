 
import {
  uploadApplicantResume,
  removeApplicantResume,
} from "../services/resume.service.js";

export const uploadResume = async (req, res, next) => {
  try {
    const result = await uploadApplicantResume(
      req.user.id,
      req.file
    );

    return res.status(200).json({
      success: true,
      message: "Resume uploaded successfully.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const removeResume = async (req, res, next) => {
  try {
    const result = await removeApplicantResume(req.user.id);

    return res.status(200).json({
      success: true,
      message: "Resume removed successfully.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
