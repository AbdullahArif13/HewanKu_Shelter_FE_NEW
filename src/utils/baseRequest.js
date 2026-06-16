import axios from "axios";

export const axiosBaseConfig = {
  baseURL: `${process.env.API_BASE_URL}`,
  headers: {
    "X-Client-Type": "web",
    "Content-Type": "application/json",
  },
  timeout: 30000,
};

const request = axios.create(axiosBaseConfig);

// Request interceptor: Add Bearer token and handle FormData
request.interceptors.request.use((config) => {
  // Handle FormData - remove Content-Type to let browser set it with boundary
  if (config.data instanceof FormData) {
    if (config.headers && config.headers["Content-Type"]) {
      delete config.headers["Content-Type"];
    }
  }

  // Add Bearer token from localStorage if available
  if (typeof window !== "undefined") {
    const authUser = window.localStorage.getItem("auth_user");
    if (authUser) {
      try {
        const user = JSON.parse(authUser);
        const token = user?.token || user?.accessToken || user?.authToken;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (e) {
        // Invalid JSON, skip token injection
      }
    }
  }

  return config;
});

// Response interceptor: Handle errors globally
request.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle network errors
    if (error.code === "ERR_NETWORK") {
      return Promise.reject({
        success: false,
        message: "Network Error or Server Unreachable",
        statusCode: 503,
      });
    }

    // Handle 401 Unauthorized - redirect to login
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        window.localStorage.removeItem("auth_user");
        // Optional: redirect to login
        // window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default request;

export function handleAxiosError(error) {
  let errorResponse = {
    success: false,
    message: "Unknown Error",
    details: null,
    statusCode: 500,
  };

  if (axios.isAxiosError(error)) {
    if (error.response) {
      errorResponse = {
        success: false,
        message: error.response.data?.message || error.message || "API Error",
        details: error.response.data || null,
        statusCode: error.response.status,
      };
    } else {
      errorResponse = {
        success: false,
        message: "Network Error or Request Timeout",
        details: null,
        statusCode: 503,
      };
    }
  } else if (error instanceof Error) {
    errorResponse.message = error.message;
  }

  return errorResponse;
}
