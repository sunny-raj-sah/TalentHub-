
import { createSlice } from "@reduxjs/toolkit";

import {
  fetchMyProfileThunk,
  updateMyProfileThunk,
} from "./profileThunks";

const initialState = {
  user: null,
  profile: null,

  isLoading: false,
  isUpdating: false,

  error: null,
  updateError: null,
  updateSuccess: null,
};

const profileSlice = createSlice({
  name: "profile",
  initialState,

  reducers: {
    clearProfileError: (state) => {
      state.error = null;
    },

    clearProfileFeedback: (state) => {
      state.updateError = null;
      state.updateSuccess = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // Fetch profile
      .addCase(fetchMyProfileThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMyProfileThunk.fulfilled, (state, action) => {
        state.isLoading = false;

        state.user = action.payload.data?.user || null;
        state.profile = action.payload.data?.profile || null;
      })
      .addCase(fetchMyProfileThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.payload || "Unable to fetch profile.";
      })

      // Update profile
      .addCase(updateMyProfileThunk.pending, (state) => {
        state.isUpdating = true;
        state.updateError = null;
        state.updateSuccess = null;
      })
      .addCase(updateMyProfileThunk.fulfilled, (state, action) => {
        state.isUpdating = false;

        state.user = action.payload.data?.user || state.user;
        state.profile =
          action.payload.data?.profile || state.profile;

        state.updateSuccess =
          action.payload.message || "Profile updated successfully.";
      })
      .addCase(updateMyProfileThunk.rejected, (state, action) => {
        state.isUpdating = false;
        state.updateError =
          action.payload || "Unable to update profile.";
      });
  },
});

export const {
  clearProfileError,
  clearProfileFeedback,
} = profileSlice.actions;

export default profileSlice.reducer;
