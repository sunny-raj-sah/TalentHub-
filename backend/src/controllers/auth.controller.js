
import {
  applicantRegistrationSchema,
  recruiterRegistrationSchema,
    loginSchema,
} from "../validators/auth.validator.js";

import {   registerUser,
  loginUser,
  refreshUserSession,
  logoutUser, } from "../services/auth.service.js";

  import { refreshCookieOptions } from "../utils/cookie.utils.js";

const handleRegistration = async (req, res, next, schema, role) => {
  try {
    // Validate incoming registration data
    const validation = schema.safeParse(req.body);

    if (!validation.success) {
      const error = new Error("Please check your registration details");

      error.statusCode = 400;
      error.errors = validation.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      }));

      throw error;
    }

    // Register user with the role assigned by the server
    // const user = await registerUser(validation.data, role);

    // return res.status(201).json({
    //   success: true,
    //   message: `${role.toLowerCase()} account registered successfully`,
    //   data: {
    //     user,
    //   },
    // });
    const result = await registerUser(validation.data, role);

// Set refresh token in HttpOnly cookie
res.cookie(
  "refreshToken",
  result.refreshToken,
  refreshCookieOptions
);

return res.status(201).json({
  success: true,
  message: "Registration successful. You are now logged in.",
  data: {
    user: result.user,
    accessToken: result.accessToken,
  },
});
  } catch (error) {
    next(error);
  }
};


export const login = async (req, res, next) => {
  try {
    const validation = loginSchema.safeParse(req.body);

    if (!validation.success) {
      const error = new Error("Please check your login details");

      error.statusCode = 400;
      error.errors = validation.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      }));

      throw error;
    }

    const { email, password } = validation.data;

    // const result = await loginUser(email, password);

    const result = await loginUser(email, password);

// Send refresh token only through the HttpOnly cookie
res.cookie(
  "refreshToken",
  result.refreshToken,
  refreshCookieOptions
);

return res.status(200).json({
  success: true,
  message: "Login successful",
  data: {
    user: result.user,
    accessToken: result.accessToken,
  },
});

    // return res.status(200).json({
    //   success: true,
    //   message: "Login successful",
    //   data: result,
    // });
  } catch (error) {
    next(error);
  }
};



export const refreshSession = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      const error = new Error("Refresh token is required");
      error.statusCode = 401;
      throw error;
    }

    const result = await refreshUserSession(refreshToken);

    res.cookie(
      "refreshToken",
      result.refreshToken,
      refreshCookieOptions
    );

    return res.status(200).json({
      success: true,
      message: "Session refreshed successfully",
      data: {
        accessToken: result.accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    await logoutUser(refreshToken);

    const { maxAge, ...clearOptions } = refreshCookieOptions;

    res.clearCookie("refreshToken", clearOptions);

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};



export const getCurrentUser = async (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Current user retrieved successfully",
    data: {
      user: req.user,
    },
  });
};


export const registerApplicant = (req, res, next) =>
  handleRegistration(
    req,
    res,
    next,
    applicantRegistrationSchema,
    "APPLICANT"
  );

export const registerRecruiter = (req, res, next) =>
  handleRegistration(
    req,
    res,
    next,
    recruiterRegistrationSchema,
    "RECRUITER"
  );
