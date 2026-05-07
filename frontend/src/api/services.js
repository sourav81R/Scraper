import api from "./axios";

export const authApi = {
  async login(payload) {
    const { data } = await api.post("/api/auth/login", payload);
    return data;
  },
  async register(payload) {
    const { data } = await api.post("/api/auth/register", payload);
    return data;
  },
  async google(idToken) {
    const { data } = await api.post("/api/auth/google", { idToken });
    return data;
  },
  async me() {
    const { data } = await api.get("/api/auth/me");
    return data;
  },
  async googleStatus() {
    const { data } = await api.get("/api/auth/google/status");
    return data;
  },
};

export const storiesApi = {
  async home() {
    const { data } = await api.get("/api/stories/home");
    return data;
  },
  async list(params) {
    const { data } = await api.get("/api/stories", { params });
    return data;
  },
  async stats() {
    const { data } = await api.get("/api/stories/stats/overview");
    return data;
  },
  async bookmarks() {
    const { data } = await api.get("/api/stories/bookmarks");
    return data;
  },
  async toggleBookmark(id) {
    const { data } = await api.post(`/api/stories/${id}/bookmark`);
    return data;
  },
  async getById(id) {
    const { data } = await api.get(`/api/stories/${id}`);
    return data;
  },
};

export const scrapeApi = {
  async trigger() {
    const { data } = await api.post("/api/scrape");
    return data;
  },
  async status() {
    const { data } = await api.get("/api/scrape/status");
    return data;
  },
};
