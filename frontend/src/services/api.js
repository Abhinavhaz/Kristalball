import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me'),
};

// Dashboard API
export const dashboardAPI = {
  getMetrics: (params) => api.get('/dashboard/metrics', { params }),
  getMovementDetails: (params) => api.get('/dashboard/movement-details', { params }),
};

// Purchases API
export const purchasesAPI = {
  getAll: (params) => api.get('/purchases', { params }),
  getById: (id) => api.get(`/purchases/${id}`),
  create: (data) => api.post('/purchases', data),
  update: (id, data) => api.put(`/purchases/${id}`, data),
  approve: (id) => api.put(`/purchases/${id}/approve`),
  deliver: (id) => api.put(`/purchases/${id}/deliver`),
};

// Transfers API
export const transfersAPI = {
  getAll: (params) => api.get('/transfers', { params }),
  getById: (id) => api.get(`/transfers/${id}`),
  create: (data) => api.post('/transfers', data),
  update: (id, data) => api.put(`/transfers/${id}`, data),
  approve: (id) => api.put(`/transfers/${id}/approve`),
  ship: (id) => api.put(`/transfers/${id}/ship`),
  receive: (id) => api.put(`/transfers/${id}/receive`),
};

// Assignments API
export const assignmentsAPI = {
  getAll: (params) => api.get('/assignments', { params }),
  getById: (id) => api.get(`/assignments/${id}`),
  create: (data) => api.post('/assignments', data),
  update: (id, data) => api.put(`/assignments/${id}`, data),
  return: (id, data) => api.put(`/assignments/${id}/return`, data),
};

// Assets API
export const assetsAPI = {
  getAll: (params) => api.get('/assets', { params }),
  getById: (id) => api.get(`/assets/${id}`),
  create: (data) => api.post('/assets', data),
  update: (id, data) => api.put(`/assets/${id}`, data),
  delete: (id) => api.delete(`/assets/${id}`),
};

// Bases API
export const basesAPI = {
  getAll: (params) => api.get('/bases', { params }),
  getById: (id) => api.get(`/bases/${id}`),
  create: (data) => api.post('/bases', data),
  update: (id, data) => api.put(`/bases/${id}`, data),
  delete: (id) => api.delete(`/bases/${id}`),
};

// Inventory API
export const inventoryAPI = {
  getAll: (params) => api.get('/inventory', { params }),
  getByBase: (baseId, params) => api.get(`/inventory/base/${baseId}`, { params }),
  update: (id, data) => api.put(`/inventory/${id}`, data),
};

export default api;
