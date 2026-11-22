
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import jobsReducer from "../features/jobs/jobsSlice";
import applicationsReducer from "../features/applications/applicationsSlice";
import bookmarksReducer from "../features/bookmarks/bookmarksSlice";
import profileReducer from "../features/profile/profileSlice";
import recruiterReducer from "../features/recruiter/recruiterSlice";


export const store = configureStore({
  reducer: {
    auth: authReducer,
     jobs: jobsReducer,
      applications: applicationsReducer,
        bookmarks: bookmarksReducer,
         profile: profileReducer,
         recruiter: recruiterReducer,
  },
});

