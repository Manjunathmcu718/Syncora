import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.response.use(
  (response) => response.data.data ?? response.data,
  (error) => {
    const message =
      error.response?.data?.error ||
      error.response?.data?.errors?.[0]?.msg ||
      error.message ||
      "Something went wrong";

    return Promise.reject(new Error(message));
  },
);

export const tasksApi = {
  getAll: () => api.get("/tasks"),
  getById: (id) => api.get(`/tasks/${id}`),
  create: (data) => api.post("/tasks", data),
  update: (id, data) => api.put(`/tasks/${id}`, data),
  delete: (id) => api.delete(`/tasks/${id}`),
};
