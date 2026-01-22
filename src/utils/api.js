import axios from 'axios';
import { toast } from 'react-toastify';

// Create axios instance with base configuration 
const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
//   withCredentials: true,
});
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken') || localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {  
      switch (error.response.status) {
        case 401:
          localStorage.removeItem('authToken');
          localStorage.removeItem('adminToken');
          localStorage.removeItem('accountType');
          
          // Determine redirect based on current path
          const currentPath = window.location.pathname;
          if (currentPath.startsWith('/admin')) {
            window.location.href = '/admin/login';
          } else if (currentPath.startsWith('/organization')) {
            window.location.href = '/organization/login';
          } else {
            window.location.href = '/login';
          }
          break;
        case 403:
          // Forbidden
          // console.error('Access forbidden');
          toast.error('You do not have permission to perform this action.');
          break;
        case 404:
          // Not found
          // console.error('Resource not found');
          toast.error('Requested resource not found.');
          break;
        case 422:
          // Validation error
          // console.error('Validation error:', error.response.data);
          toast.error('Validation error occurred.');
          break;
        case 500:
          // Server error
          toast.error('A server error occurred. Please try again later.');
          // console.error('Server error');
          break;
        default:
          // console.error('An error occurred:', error.response.data);
          toast.error('An error occurred. Please try again later.');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
