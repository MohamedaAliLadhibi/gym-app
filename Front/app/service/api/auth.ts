import apiClient from './client';
import { LoginData, RegisterData, AuthResponse, User } from '../types';
export const authAPI = {
  // Login with email/password
// In app/service/api/auth.ts login function
login: async (email: string, password: string): Promise<AuthResponse> => {
  console.log('Sending login request to:', '/users/login');
  console.log('Data:', { email, password });
  
  try {
    const response = await apiClient.post('/users/login', { email, password });
    console.log('Login response:', response);
    return response.data;
  } catch (error) {
    console.error('Login API error:', error);
    throw error;
  }
},
  
  // Register new user
  register: async (userData: RegisterData): Promise<AuthResponse> => {
    const response = await apiClient.post('/users/register', userData);
    return response.data;
  },
  
  // Forgot password - CHECK YOUR BACKEND PATH
  forgotPassword: async (email: string): Promise<{ message: string }> => {
    const response = await apiClient.post('/users/forgot-password', { email });
    return response.data;
  },
  
  // Reset password - CHECK YOUR BACKEND PATH
  resetPassword: async (token: string, newPassword: string): Promise<{ message: string }> => {
    const response = await apiClient.post('/users/reset-password', { token, newPassword });
    return response.data;
  },
  
  // Logout - CHECK YOUR BACKEND PATH
  logout: async (): Promise<{ message: string }> => {
    const response = await apiClient.post('/users/logout');
    return response.data;
  },
  
  // Get current user profile
  getProfile: async (): Promise<User> => {
    const response = await apiClient.get('/users/profile');
    return response.data;
  },
  
  // Update profile
  updateProfile: async (profileData: Partial<User>): Promise<User> => {
    const response = await apiClient.put('/users/profile', profileData);
    return response.data;
  },
};