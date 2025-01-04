import axiosInstance from './axiosInstance';
import { LoginCredentials, AuthResponse } from '../types/auth';


export const loginUser = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  try {
    const response = await axiosInstance.post<AuthResponse>(
      '/user/login/', 
      new URLSearchParams({
        username: credentials.username,
        password: credentials.password
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Login failed:', error);
    throw new Error('Login failed');
  }
};