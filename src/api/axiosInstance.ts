import axios from 'axios';
import useAuthStore from '../store/useAuthStore';

const axiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/', // FastAPI backend'inizin URL'si
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

axiosInstance.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;