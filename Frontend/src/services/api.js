import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Request interceptor to add the auth token header to requests
api.interceptors.request.use(
  (config) => {
    const adminToken = localStorage.getItem('adminToken');
    const userToken = localStorage.getItem('userToken');

    // If an authorization header is already explicitly set, keep it
    if (config.headers.Authorization) {
      return config;
    }

    const url = config.url || '';
    const isAdminRoute = url.includes('/admin') || url.startsWith('admin');
    const isUserRoute = url.includes('/user') || url.startsWith('user');

    if (isAdminRoute && adminToken) {
      config.headers.Authorization = `Bearer ${adminToken}`;
    } else if (isUserRoute && userToken) {
      config.headers.Authorization = `Bearer ${userToken}`;
    } else if (userToken) {
      config.headers.Authorization = `Bearer ${userToken}`;
    } else if (adminToken) {
      config.headers.Authorization = `Bearer ${adminToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
