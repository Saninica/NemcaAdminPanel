import axiosInstance from './axiosInstance';
import { LoginCredentials, AuthResponse } from '../types/auth';

export const loginUser = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const response = await axiosInstance.post<AuthResponse>('/auth/login', credentials);
  return response.data;
};