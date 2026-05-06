import axios from "axios";

const browserHost = window.location.hostname;
const isLocalFrontend =
  browserHost === "localhost" || browserHost === "127.0.0.1";
const localApiUrl = "http://localhost:5001";
const productionApiUrl = "https://scraper-ii5g.onrender.com";
const envApiUrl = import.meta.env.VITE_API_URL?.trim();
const fallbackApiUrl = isLocalFrontend ? localApiUrl : productionApiUrl;
const resolvedApiUrl =
  !isLocalFrontend && envApiUrl?.includes("localhost")
    ? productionApiUrl
    : envApiUrl || fallbackApiUrl;

const api = axios.create({
  baseURL: resolvedApiUrl.replace(/\/$/, ""),
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("hn-tracker-token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
