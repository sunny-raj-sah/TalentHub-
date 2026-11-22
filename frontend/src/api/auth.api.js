
import api from "./axios";

// Register a new applicant
export const registerApplicant = async (userData) => {
  const response = await api.post("/auth/register/applicant", userData);
  return response.data;
};

// Register a new recruiter
export const registerRecruiter = async (userData) => {
  const response = await api.post("/auth/register/recruiter", userData);
  return response.data;
};

// Login existing user
export const loginUser = async (credentials) => {
  const response = await api.post("/auth/login", credentials);
  return response.data;
};

// Refresh access token using the HttpOnly refresh cookie
export const refreshSession = async () => {
  const response = await api.post("/auth/refresh");
  return response.data;
};

// Get currently authenticated user
export const getCurrentUser = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};

// Logout current user
export const logoutUser = async () => {
  const response = await api.post("/auth/logout");
  return response.data;
};
