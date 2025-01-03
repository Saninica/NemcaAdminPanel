import axios from 'axios';
import useAuthStore from '../store/useAuthStore';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000/api', // FastAPI backend'inizin URL'si
  headers: {
    'Content-Type': 'application/json',
  },
});

// İstek öncesi token ekleme
axiosInstance.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;