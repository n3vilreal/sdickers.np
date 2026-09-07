import axios from "axios";

const rawUrl = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
const baseURL = rawUrl.startsWith("http") ? rawUrl : `https://${rawUrl}`;

const api = axios.create({ baseURL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = token;
  }
  return config;
});

export default api;
