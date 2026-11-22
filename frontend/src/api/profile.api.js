
import api from "./axios";

export const getMyProfile = async () => {
  const response = await api.get("/users/profile");
  return response.data;
};

export const updateMyProfile = async (profileData) => {
  const response = await api.put("/users/profile", profileData);
  return response.data;
};

export const getUserPublicProfile = async (userId) => {
  const response = await api.get(`/users/${userId}`);
  return response.data;
};
