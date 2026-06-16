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

const TOKEN_KEYS = [
  "token",
  "accessToken",
  "authToken",
  "access_token",
  "bearerToken",
];

function findTokenInObject(value, depth = 3) {
  if (!value || typeof value !== "object") return null;

  for (const key of Object.keys(value)) {
    if (TOKEN_KEYS.includes(key)) {
      return value[key];
    }
  }

  if (depth <= 0) return null;

  for (const nested of Object.values(value)) {
    if (typeof nested === "object" && nested !== null) {
      const token = findTokenInObject(nested, depth - 1);
      if (token) return token;
    }
  }

  return null;
}

function resolveStoredToken(user) {
  return findTokenInObject(user, 4);
}

function formatBearerToken(token) {
  if (!token) return null;
  const rawToken = String(token).trim();
  if (/^Bearer\s+/i.test(rawToken)) return rawToken;
  return `Bearer ${rawToken}`;
}

// Request interceptor: Add Bearer token and handle FormData
request.interceptors.request.use((config) => {
  // Handle FormData - remove Content-Type to let browser set it with boundary
  if (typeof FormData !== "undefined" && config.data instanceof FormData) {
    if (config.headers && config.headers["Content-Type"]) {
      delete config.headers["Content-Type"];
    }
  }

  if (!config.headers) {
    config.headers = {};
  }

  if (config.token) {
    config.headers.Authorization = formatBearerToken(config.token);
    console.log(`✓ Authorization header set from config.token for ${config.url}`);
  } else if (typeof window !== "undefined") {
    const authUser = window.localStorage.getItem("auth_user");
    console.log(`🔐 [DEBUG] Checking auth_user from localStorage for ${config.url}:`, authUser ? "EXISTS" : "MISSING");
    
    if (authUser) {
      try {
        const user = JSON.parse(authUser);
        console.log(`🔐 [DEBUG] Parsed auth_user object:`, user);
        
        const token = resolveStoredToken(user);
        console.log(`🔐 [DEBUG] Extracted token:`, token ? `"${token.substring(0, 20)}..."` : "NULL");
        
        if (token) {
          const bearerToken = formatBearerToken(token);
          config.headers.Authorization = bearerToken;
          console.log(`✅ Authorization header SET for ${config.url}: ${bearerToken.substring(0, 30)}...`);
        } else {
          console.warn(`⚠ No token found in auth_user for ${config.url}`);
        }
      } catch (e) {
        console.error(`⚠ Invalid JSON in localStorage.auth_user:`, e.message);
      }
    } else {
      console.warn(`⚠ localStorage.auth_user not found for ${config.url}`);
    }
  }

  console.log(`📤 [${config.method?.toUpperCase()}] ${config.url}`, {
    hasAuth: !!config.headers.Authorization,
    authHeader: config.headers.Authorization ? config.headers.Authorization.substring(0, 30) + "..." : "NONE"
  });

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
