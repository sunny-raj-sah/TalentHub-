
import api from "./axios";

export const getMyBookmarks = async (params = {}) => {
  const response = await api.get("/bookmarks", { params });
  return response.data;
};

export const addBookmark = async (jobId) => {
  const response = await api.post(`/bookmarks/${jobId}`);
  return response.data;
};

export const removeBookmark = async (jobId) => {
  const response = await api.delete(`/bookmarks/${jobId}`);
  return response.data;
};
