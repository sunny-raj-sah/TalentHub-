
import jwt from "jsonwebtoken";

import { env } from "../config/env.js";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Check whether Authorization header exists
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      const error = new Error("Authentication required");
      error.statusCode = 401;
      throw error;
    }

    // Extract access token
    const accessToken = authHeader.split(" ")[1];

    if (!accessToken) {
      const error = new Error("Access token is required");
      error.statusCode = 401;
      throw error;
    }

    // Verify JWT signature and expiration
    const decoded = jwt.verify(
      accessToken,
      env.ACCESS_TOKEN_SECRET
    );

    if (
      typeof decoded === "string" ||
      !decoded.userId
    ) {
      const error = new Error("Invalid access token");
      error.statusCode = 401;
      throw error;
    }

    // Fetch the current user from MongoDB
    const user = await User.findById(decoded.userId);

    if (!user || !user.isActive) {
      const error = new Error("User account not found or inactive");
      error.statusCode = 401;
      throw error;
    }

    // Attach authenticated user to the request
    req.user = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    };

    next();
  } catch (error) {
    const authError = new Error(
      error.name === "TokenExpiredError"
        ? "Access token has expired"
        : "Invalid or expired access token"
    );

    authError.statusCode = 401;

    next(authError);
  }
};
