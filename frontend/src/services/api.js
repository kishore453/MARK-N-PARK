import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('mnp_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Centralized Error Normalization
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      
      // Auto logout on 401 if token was expired
      if (status === 401) {
        localStorage.removeItem('mnp_token');
        localStorage.removeItem('mnp_user');
        if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
          // Soft redirect
          window.location.href = '/login';
        }
      }
      
      const customMessage = data?.message || 'An error occurred during request processing';
      return Promise.reject(new Error(customMessage));
    }
    
    return Promise.reject(new Error('Network connection failed. Please check your internet or server status.'));
  }
);

export default api;
