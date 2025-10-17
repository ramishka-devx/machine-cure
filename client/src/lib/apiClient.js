import axios from "axios";

// Base URL can be configured via Vite env. Falls back to local API.
const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000/api";

// Create a single Axios instance for the whole app
const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  // You can set a timeout if you want
  // timeout: 15000,
});

// Attach auth token (if present) to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Normalize errors coming from server/network
api.interceptors.response.use(
  (res) => res,
  (error) => {
    const normalized = {
      status: error?.response?.status,
      message:
        error?.response?.data?.message || error?.message || "Request failed",
      data: error?.response?.data,
      url: error?.config?.url,
      method: error?.config?.method,
    };
    return Promise.reject(normalized);
  }
);

// Thin helpers that always return response.data and throw normalized errors
const request = async (method, url, data, config) => {
  const res = await api({ method, url, data, ...config });
  return res.data;
};

export const http = {
  get: (url, config) => request("get", url, undefined, config),
  post: (url, data, config) => request("post", url, data, config),
  put: (url, data, config) => request("put", url, data, config),
  patch: (url, data, config) => request("patch", url, data, config),
  delete: (url, config) => request("delete", url, undefined, config),
};

// Persist/remove token in local storage
export const setAuthToken = (token) => {
  if (token) localStorage.setItem("token", token);
  else localStorage.removeItem("token");
};

// Optional: quick CRUD generator for REST resources
export const createResource = (basePath) => ({
  list: (params) => http.get(basePath, { params }),
  get: (id) => http.get(`${basePath}/${id}`),
  create: (body) => http.post(basePath, body),
  update: (id, body) => http.put(`${basePath}/${id}`, body),
  remove: (id) => http.delete(`${basePath}/${id}`),
});

export default api;
