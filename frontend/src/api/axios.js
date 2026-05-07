import axios from "axios";

const browserHost = window.location.hostname;
const isLocalFrontend =
  browserHost === "localhost" || browserHost === "127.0.0.1";
const localApiUrl = "http://localhost:5000";
const productionApiUrl = "https://scraper-ii5g.onrender.com";
const envApiUrl = import.meta.env.VITE_API_URL?.trim();
const fallbackApiUrl = isLocalFrontend ? localApiUrl : productionApiUrl;
const resolvedApiUrl =
  !isLocalFrontend && envApiUrl?.includes("localhost")
    ? productionApiUrl
    : envApiUrl || fallbackApiUrl;
const wait = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms));

const api = axios.create({
  baseURL: resolvedApiUrl.replace(/\/$/, ""),
  timeout: isLocalFrontend ? 15000 : 30000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("hn-tracker-token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

const isRetryableMethod = (method) =>
  ["get", "head", "options"].includes((method || "get").toLowerCase());

const isRetryableError = (error) => {
  const status = error.response?.status;

  return (
    error.code === "ECONNABORTED" ||
    !error.response ||
    [502, 503, 504].includes(status)
  );
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalConfig = error.config;

    if (
      !originalConfig ||
      originalConfig.__retried ||
      !isRetryableMethod(originalConfig.method) ||
      !isRetryableError(error)
    ) {
      return Promise.reject(error);
    }

    originalConfig.__retried = true;
    await wait(1200);

    return api.request(originalConfig);
  }
);

export default api;
