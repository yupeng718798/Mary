import axios from 'axios';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000').replace(/\/$/, '');

export const DEMO_USER_ID = '00000000-0000-0000-0000-000000000001';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000,
});

apiClient.interceptors.request.use((config) => {
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error('API Error:', error.response.status, error.response.data);
    } else if (error.request) {
      console.error('Network Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default apiClient;
