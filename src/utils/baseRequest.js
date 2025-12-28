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

request.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === "ERR_NETWORK") {
      return Promise.reject({
        success: false,
        message: "Network Error or Server Unreachable",
        statusCode: 503,
      });
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
