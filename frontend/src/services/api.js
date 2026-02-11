import axios from 'axios';
import { mockAuthAPI, mockTaskAPI } from './mockApi';

const API_URL = '/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if it exists
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

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - logout user
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Check if backend is available
let isBackendAvailable = null;

const checkBackend = async () => {
  if (isBackendAvailable !== null) return isBackendAvailable;
  
  try {
    await axios.get(`${API_URL}/health`, { timeout: 2000 });
    isBackendAvailable = true;
    return true;
  } catch (error) {
    isBackendAvailable = false;
    return false;
  }
};

// Auth API calls - uses mock API if backend is not available
export const authAPI = {
  signup: async (userData) => {
    const available = await checkBackend();
    if (available) {
      return api.post('/auth/signup', userData);
    }
    return mockAuthAPI.signup(userData);
  },
  
  login: async (credentials) => {
    const available = await checkBackend();
    if (available) {
      return api.post('/auth/login', credentials);
    }
    return mockAuthAPI.login(credentials);
  },
  
  getMe: async () => {
    const available = await checkBackend();
    if (available) {
      return api.get('/auth/me');
    }
    return mockAuthAPI.getMe();
  },
  
  updateProfile: async (userData) => {
    const available = await checkBackend();
    if (available) {
      return api.put('/auth/updateprofile', userData);
    }
    return mockAuthAPI.updateProfile(userData);
  },
  
  changePassword: async (passwordData) => {
    const available = await checkBackend();
    if (available) {
      return api.put('/auth/changepassword', passwordData);
    }
    return mockAuthAPI.changePassword(passwordData);
  },
  
  deleteAccount: async () => {
    const available = await checkBackend();
    if (available) {
      return api.delete('/auth/deleteaccount');
    }
    return mockAuthAPI.deleteAccount();
  },
  
  logout: async () => {
    const available = await checkBackend();
    if (available) {
      return api.post('/auth/logout');
    }
    return mockAuthAPI.logout();
  }
};

// Task API calls - uses mock API if backend is not available
export const taskAPI = {
  getAll: async (params) => {
    const available = await checkBackend();
    if (available) {
      return api.get('/tasks', { params });
    }
    return mockTaskAPI.getAll(params);
  },
  
  getOne: async (id) => {
    const available = await checkBackend();
    if (available) {
      return api.get(`/tasks/${id}`);
    }
    return mockTaskAPI.getOne(id);
  },
  
  create: async (taskData) => {
    const available = await checkBackend();
    if (available) {
      return api.post('/tasks', taskData);
    }
    return mockTaskAPI.create(taskData);
  },
  
  update: async (id, taskData) => {
    const available = await checkBackend();
    if (available) {
      return api.put(`/tasks/${id}`, taskData);
    }
    return mockTaskAPI.update(id, taskData);
  },
  
  delete: async (id) => {
    const available = await checkBackend();
    if (available) {
      return api.delete(`/tasks/${id}`);
    }
    return mockTaskAPI.delete(id);
  },
  
  getStats: async () => {
    const available = await checkBackend();
    if (available) {
      return api.get('/tasks/stats');
    }
    return mockTaskAPI.getStats();
  }
};

// Export mock API for direct access if needed
export { mockAuthAPI, mockTaskAPI };

export default api;

