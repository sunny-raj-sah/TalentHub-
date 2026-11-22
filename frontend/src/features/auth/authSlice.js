 
import { createSlice } from "@reduxjs/toolkit";

import {
  registerApplicantThunk,
  registerRecruiterThunk,
  loginThunk,
  initializeAuthThunk,
  logoutThunk,
} from "./authThunks";

const initialState = {
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isInitializing: true,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    clearAuthError: (state) => {
      state.error = null;
    },
    clearAuthSession: (state) => {
  state.user = null;
  state.accessToken = null;
  state.isAuthenticated = false;
  state.isInitializing = false;
  state.isLoading = false;
  state.error = null;
},
  },

  extraReducers: (builder) => {
    // Registration and login
    const handleAuthSuccess = (state, action) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = true;
      state.isInitializing = false;
      state.isLoading = false;
      state.error = null;
    };

    const handleAuthFailure = (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    };

    builder
      .addCase(registerApplicantThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerApplicantThunk.fulfilled, handleAuthSuccess)
      .addCase(registerApplicantThunk.rejected, handleAuthFailure)

      .addCase(registerRecruiterThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerRecruiterThunk.fulfilled, handleAuthSuccess)
      .addCase(registerRecruiterThunk.rejected, handleAuthFailure)

      .addCase(loginThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, handleAuthSuccess)
      .addCase(loginThunk.rejected, handleAuthFailure)

      // Session restoration
      .addCase(initializeAuthThunk.pending, (state) => {
        state.isInitializing = true;
      })
      .addCase(initializeAuthThunk.fulfilled, (state, action) => {
        state.isInitializing = false;

        if (action.payload) {
          state.user = action.payload.user;
          state.accessToken = action.payload.accessToken;
          state.isAuthenticated = true;
        } else {
          state.user = null;
          state.accessToken = null;
          state.isAuthenticated = false;
        }
      })
      .addCase(initializeAuthThunk.rejected, (state) => {
        state.user = null;
        state.accessToken = null;
        state.isAuthenticated = false;
        state.isInitializing = false;
      })

      // Logout
      .addCase(logoutThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logoutThunk.fulfilled, (state) => {
        state.user = null;
        state.accessToken = null;
        state.isAuthenticated = false;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(logoutThunk.rejected, (state, action) => {
        // Clear local authentication even if the server request fails.
        state.user = null;
        state.accessToken = null;
        state.isAuthenticated = false;
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearAuthError, clearAuthSession } = authSlice.actions;

export default authSlice.reducer;
