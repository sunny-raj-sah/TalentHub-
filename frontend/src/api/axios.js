 
import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

let accessToken = null;
let isRefreshing = false;
let failedQueue = [];

let onSessionExpired = null;

export const setSessionExpiredHandler = (handler) => {
  onSessionExpired = handler;
};

export const setAccessToken = (token) => {
  accessToken = token;
};

export const getAccessToken = () => accessToken;

export const clearAccessToken = () => {
  accessToken = null;
};

const processQueue = (error, token = null) => {
  failedQueue.forEach((request) => {
    if (error) {
      request.reject(error);
    } else {
      request.resolve(token);
    }
  });

  failedQueue = [];
};


// Attach the current access token to outgoing requests.
api.interceptors.request.use(
  (config) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Refresh the access token and retry failed requests.
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (!originalRequest || error.response?.status !== 401) {
      return Promise.reject(error);
    }

    const requestUrl = originalRequest.url || "";

    // Never attempt refresh for authentication endpoints.
    const excludedUrls = [
      "/auth/login",
      "/auth/register/applicant",
      "/auth/register/recruiter",
      "/auth/refresh",
      "/auth/logout",
    ];

    const isExcludedRequest = excludedUrls.some((url) =>
      requestUrl.includes(url)
    );

    if (isExcludedRequest || originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    // Queue requests while another request is refreshing the token.
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        })
        .catch((refreshError) => Promise.reject(refreshError));
    }

    isRefreshing = true;

    try {
      // The browser sends the HttpOnly refresh-token cookie.
      const response = await api.post("/auth/refresh");

      const newAccessToken = response.data?.data?.accessToken;

      if (!newAccessToken) {
        throw new Error("Unable to refresh authentication session.");
      }

      setAccessToken(newAccessToken);

      // Release all queued requests with the new token.
      processQueue(null, newAccessToken);

      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

      return api(originalRequest);
    } catch (refreshError) {
      clearAccessToken();
      processQueue(refreshError);

      onSessionExpired?.();

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);


// Attach the current access token to outgoing requests.
// api.interceptors.request.use(
//   (config) => {
//     if (accessToken) {
//       config.headers.Authorization = `Bearer ${accessToken}`;
//     }

//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// Refresh the access token and retry failed requests.
// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     if (!originalRequest || error.response?.status !== 401) {
//       return Promise.reject(error);
//     }

//     const requestUrl = originalRequest.url || "";

//     // Never attempt refresh for authentication endpoints.
//     const excludedUrls = [
//       "/auth/login",
//       "/auth/register/applicant",
//       "/auth/register/recruiter",
//       "/auth/refresh",
//       "/auth/logout",
//     ];

//     const isExcludedRequest = excludedUrls.some((url) =>
//       requestUrl.includes(url)
//     );

//     if (isExcludedRequest || originalRequest._retry) {
//       return Promise.reject(error);
//     }

//     originalRequest._retry = true;

//     // Queue requests while another request is refreshing the token.
//     if (isRefreshing) {
//       return new Promise((resolve, reject) => {
//         failedQueue.push({ resolve, reject });
//       })
//         .then((token) => {
//           originalRequest.headers.Authorization = `Bearer ${token}`;
//           return api(originalRequest);
//         })
//         .catch((refreshError) => Promise.reject(refreshError));
//     }

//     isRefreshing = true;

//     try {
//       // The browser sends the HttpOnly refresh-token cookie.
//       const response = await api.post("/auth/refresh");

//       const newAccessToken = response.data?.data?.accessToken;

//       if (!newAccessToken) {
//         throw new Error("Unable to refresh authentication session.");
//       }

//       setAccessToken(newAccessToken);

//       // Release all queued requests with the new token.
//       processQueue(null, newAccessToken);

//       originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

//       return api(originalRequest);
//       } catch (refreshError) {
//   clearAccessToken();
//   processQueue(refreshError);

//   onSessionExpired?.();

//   return Promise.reject(refreshError);

//     // } catch (refreshError) {
//     //   clearAccessToken();
//     //   processQueue(refreshError);

//     //   return Promise.reject(refreshError);
//     } finally {
//       isRefreshing = false;
//     }
//   }
// );

export default api;
