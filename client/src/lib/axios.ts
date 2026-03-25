import axios, { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from "axios";

const BASE_URL = "https://api.growtt.com";

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: false, // needed for CSRF cookie handling
  timeout: 15000,
});

// ------- Request Interceptor -------
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("access_token");
    if (token && config.headers) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// ------- Response Interceptor -------
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response) {
      const { status } = error.response;

      if (status === 401) {
        // Token expired — clear storage and redirect to login
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/sign-in";
      }

      if (status === 403) {
        console.error("Forbidden: You do not have permission.");
      }

      if (status >= 500) {
        console.error("Server error. Please try again later.");
      }
    } else if (error.request) {
      console.error("Network error details:", {
    message: error.message,
    code: error.code,           
    url: error.config?.url,
    baseURL: error.config?.baseURL,
  });
    }

    return Promise.reject(error);
  }
);

// ------- Helpers -------
function getCsrfTokenFromCookie(): string | null {
  const match = document.cookie.match(/csrftoken=([^;]+)/);
  return match ? match[1] : null;
}