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
const baseURL = resolvedApiUrl.replace(/\/$/, "");

const api = axios.create({
  baseURL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
