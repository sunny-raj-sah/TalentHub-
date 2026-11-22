
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

import ApplicantProfile from "../models/ApplicantProfile.js";
import RecruiterProfile from "../models/RecruiterProfile.js";

import {    generateAccessToken,
  generateRefreshToken,
  hashRefreshToken, } from "../utils/token.utils.js";


import User from "../models/User.js";

const SALT_ROUNDS = 12;


// const createUserSession = async (user) => {
//   const accessToken = generateAccessToken(user);
//   const refreshToken = generateRefreshToken(user);

//   user.refreshTokenHash = hashRefreshToken(refreshToken);

//   await user.save();

//   const userObject = user.toObject();

//   delete userObject.password;
//   delete userObject.refreshTokenHash;

//   return {
//     user: userObject,
//     accessToken,
//     refreshToken,
//   };
// };

const createUserSession = async (user, session) => {
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  user.refreshTokenHash = hashRefreshToken(refreshToken);

  // await user.save({ session });
if (session) {
  await user.save({ session });
} else {
  await user.save();
}
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.refreshTokenHash;

  return {
    user: userObject,
    accessToken,
    refreshToken,
  };
};

// export const registerUser = async (userData, role) => {
//   try {
//     const { name, email, password } = userData;

//     // Check whether the email is already registered
//     const existingUser = await User.findOne({ email });

//     if (existingUser) {
//       const error = new Error(
//         "An account with this email already exists"
//       );

//       error.statusCode = 409;
//       throw error;
//     }

//     // Hash the password before storing it
//     const hashedPassword = await bcrypt.hash(
//       password,
//       SALT_ROUNDS
//     );

//     // Create the user with a server-assigned role
//     const user = await User.create({
//       name,
//       email,
//       password: hashedPassword,
//       role,
//     });

//     // // Return user details without the password
//     // const userObject = user.toObject();

//     // delete userObject.password;

//     // return userObject;

//     return await createUserSession(user);
//   } catch (error) {
//     // Handle duplicate email errors, including concurrent requests
//     if (error.code === 11000) {
//       const duplicateError = new Error(
//         "An account with this email already exists"
//       );

//       duplicateError.statusCode = 409;
//       throw duplicateError;
//     }

//     throw error;
//   }
// };

export const registerUser = async (userData, role) => {
  const session = await mongoose.startSession();

  try {
    const { name, email, password } = userData;

    if (!["APPLICANT", "RECRUITER"].includes(role)) {
      const error = new Error("Invalid registration role");
      error.statusCode = 400;
      throw error;
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      const error = new Error("Email is already registered");
      error.statusCode = 409;
      throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    let sessionData;

    await session.withTransaction(async () => {
      const [user] = await User.create(
        [
          {
            name,
            email,
            password: hashedPassword,
            role,
          },
        ],
        { session }
      );

      if (role === "APPLICANT") {
        await ApplicantProfile.create(
          [{ user: user._id }],
          { session }
        );
      }

      if (role === "RECRUITER") {
        await RecruiterProfile.create(
          [{ user: user._id }],
          { session }
        );
      }

      sessionData = await createUserSession(user, session);
    });

    return sessionData;
  } catch (error) {
    if (error.code === 11000) {
      const duplicateError = new Error("Email is already registered");
      duplicateError.statusCode = 409;
      throw duplicateError;
    }

    throw error;
  } finally {
    await session.endSession();
  }
};

 
// export const loginUser = async (email, password) => {
//   const user = await User.findOne({ email }).select("+password");

//   if (!user) {
//     const error = new Error("Invalid email or password");
//     error.statusCode = 401;
//     throw error;
//   }

//   if (!user.isActive) {
//     const error = new Error("Your account has been deactivated");
//     error.statusCode = 403;
//     throw error;
//   }

//   const isPasswordValid = await bcrypt.compare(
//     password,
//     user.password
//   );

//   if (!isPasswordValid) {
//     const error = new Error("Invalid email or password");
//     error.statusCode = 401;
//     throw error;
//   }

//   const accessToken = generateAccessToken(user);
//   const refreshToken = generateRefreshToken(user);

//   // Store only the refresh token hash
//   user.refreshTokenHash = hashRefreshToken(refreshToken);
//   await user.save();

//   const userObject = user.toObject();
//   delete userObject.password;
//   delete userObject.refreshTokenHash;

//   // return {
//   //   user: userObject,
//   //   accessToken,
//   //   refreshToken,
//   // };
//   return await createUserSession(user);
// };

export const loginUser = async (email, password) => {
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  if (!user.isActive) {
    const error = new Error("Your account has been deactivated");
    error.statusCode = 403;
    throw error;
  }

  const isPasswordValid = await bcrypt.compare(
    password,
    user.password
  );

  if (!isPasswordValid) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  // Generate and save the session tokens only once.
  return await createUserSession(user);
};

export const refreshUserSession = async (refreshToken) => {
  try {
    const decoded = jwt.verify(
      refreshToken,
      env.REFRESH_TOKEN_SECRET
    );

    if (typeof decoded === "string" || !decoded.userId) {
      throw new Error("Invalid refresh token");
    }

    const user = await User.findById(decoded.userId)
      .select("+refreshTokenHash");

    if (!user || !user.isActive || !user.refreshTokenHash) {
      throw new Error("Invalid refresh session");
    }

    const submittedHash = hashRefreshToken(refreshToken);

    if (submittedHash !== user.refreshTokenHash) {
      throw new Error("Refresh token has been revoked");
    }

    // Rotate the refresh token
    const newRefreshToken = generateRefreshToken(user);
    const newRefreshTokenHash = hashRefreshToken(newRefreshToken);

    // Atomic comparison prevents reuse of an already-rotated token
    const updatedUser = await User.findOneAndUpdate(
      {
        _id: user._id,
        refreshTokenHash: submittedHash,
      },
      {
        $set: {
          refreshTokenHash: newRefreshTokenHash,
        },
      },
      { new: true }
    );

    if (!updatedUser) {
      throw new Error("Refresh token has already been used");
    }

    const accessToken = generateAccessToken(updatedUser);

    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  } catch {
    const error = new Error("Invalid or expired refresh session");
    error.statusCode = 401;
    throw error;
  }
};

export const logoutUser = async (refreshToken) => {
  if (!refreshToken) {
    return;
  }

  await User.findOneAndUpdate(
    {
      refreshTokenHash: hashRefreshToken(refreshToken),
    },
    {
      $set: {
        refreshTokenHash: null,
      },
    }
  );
};

