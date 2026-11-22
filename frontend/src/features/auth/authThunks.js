 
import { createAsyncThunk } from "@reduxjs/toolkit";

import {
  registerApplicant,
  registerRecruiter,
  loginUser,
  refreshSession,
  getCurrentUser,
  logoutUser,
} from "../../api/auth.api";

import {
  setAccessToken,
  clearAccessToken,
} from "../../api/axios";

// Extract a useful backend error message
const getErrorMessage = (error) => {
  return (
    error.response?.data?.message ||
    error.message ||
    "Something went wrong. Please try again."
  );
};

// Applicant registration
export const registerApplicantThunk = createAsyncThunk(
  "auth/registerApplicant",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await registerApplicant(userData);
      const { user, accessToken } = response.data;

      setAccessToken(accessToken);

      return { user, accessToken };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

// Recruiter registration
export const registerRecruiterThunk = createAsyncThunk(
  "auth/registerRecruiter",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await registerRecruiter(userData);
      const { user, accessToken } = response.data;

      setAccessToken(accessToken);

      return { user, accessToken };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

// Login
export const loginThunk = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await loginUser(credentials);
      const { user, accessToken } = response.data;

      setAccessToken(accessToken);

      return { user, accessToken };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

// Restore session after browser refresh
//  export const initializeAuthThunk = createAsyncThunk(
//   "auth/initialize",
//   async () => {
//     try {
//       const refreshResponse = await refreshSession();
//       const { accessToken } = refreshResponse.data;

//       setAccessToken(accessToken);

//       const userResponse = await getCurrentUser();

//      return {
//   user: userResponse.data.user ?? userResponse.data,
//   accessToken,
// };
//     } catch {
//       clearAccessToken();
//       return null;
//     }
//   }
// );

// Restore session after browser refresh
export const initializeAuthThunk = createAsyncThunk(
  "auth/initialize",
  async () => {
    try {
      const refreshResponse = await refreshSession();
      const { accessToken } = refreshResponse.data;

      setAccessToken(accessToken);

      const userResponse = await getCurrentUser();

      return {
        user: userResponse.data.user ?? userResponse.data,
        accessToken,
      };
    } catch {
      clearAccessToken();
      return null;
    }
  }
);


// Logout
export const logoutThunk = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await logoutUser();
      return true;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    } finally {
      clearAccessToken();
    }
  }
);
