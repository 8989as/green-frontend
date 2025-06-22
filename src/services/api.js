// src/services/api.js
import axios from 'axios';

// Use environment variable for API URL if available, otherwise fallback to hardcoded value
const API_BASE_URL = 'http://127.0.0.1:8000';

// Check for auth token at startup (using PhoneAuth token)
const token = localStorage.getItem('auth_token');

// Create an axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  }
});

// Add request interceptor to dynamically add auth token
api.interceptors.request.use(
  config => {
    // Always get the latest token in case it was updated
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    // For specific API endpoints, ensure we're sending JSON
    if (config.url && (
      config.url.includes('/api/phone-auth/') || 
      config.url.includes('/api/v1/customer/')
    )) {
      config.headers['Content-Type'] = 'application/json';
      config.headers['Accept'] = 'application/json';
    }
    
    return config;
  },
  error => Promise.reject(error)
);

// Add interceptors for handling responses and errors
api.interceptors.response.use(
  response => response.data,
  error => {
    // Handle authentication errors (401)
    if (error.response && error.response.status === 401) {
      // Clear invalid tokens
      localStorage.removeItem('auth_token');
      
      // If we have an event system, dispatch logout event
      if (window.dispatchEvent) {
        window.dispatchEvent(new CustomEvent('auth_error'));
      }
    }
    return Promise.reject(error.response?.data || error);
  }
);

export default api;