import apiClient from './client';
import { 
  LoginData, 
  RegisterData, 
  AuthResponse, 
  User,
  ApiResponse 
} from '../types';

export const authAPI = {
  // Login with email/password
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/login', { email, password });
    return response.data;
  },
  
  // Register new user
  register: async (userData: RegisterData): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/register', userData);
    return response.data;
  },
  
  // Social login
  socialLogin: async (
    provider: 'google' | 'apple' | 'facebook', 
    token: string
  ): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/social', { provider, token });
    return response.data;
  },
  
  // Verify email
  verifyEmail: async (token: string): Promise<ApiResponse<{ verified: boolean }>> => {
    const response = await apiClient.post<ApiResponse<{ verified: boolean }>>(
      '/auth/verify-email', 
      { token }
    );
    return response.data;
  },
  
  // Forgot password
  forgotPassword: async (email: string): Promise<ApiResponse<{ sent: boolean }>> => {
    const response = await apiClient.post<ApiResponse<{ sent: boolean }>>(
      '/auth/forgot-password', 
      { email }
    );
    return response.data;
  },
  
  // Reset password
  resetPassword: async (
    token: string, 
    newPassword: string
  ): Promise<ApiResponse<{ reset: boolean }>> => {
    const response = await apiClient.post<ApiResponse<{ reset: boolean }>>(
      '/auth/reset-password', 
      { token, newPassword }
    );
    return response.data;
  },
  
  // Logout
  logout: async (): Promise<ApiResponse<{ loggedOut: boolean }>> => {
    const response = await apiClient.post<ApiResponse<{ loggedOut: boolean }>>('/auth/logout');
    return response.data;
  },
  
  // Refresh token
  refreshToken: async (refreshToken: string): Promise<{ token: string; refreshToken: string }> => {
    const response = await apiClient.post<{ token: string; refreshToken: string }>(
      '/auth/refresh', 
      { refreshToken }
    );
    return response.data;
  },
  
  // Get current user profile
  getProfile: async (): Promise<User> => {
    const response = await apiClient.get<User>('/auth/profile');
    return response.data;
  },
  
  // Update profile
  updateProfile: async (profileData: Partial<User>): Promise<User> => {
    const response = await apiClient.put<User>('/auth/profile', profileData);
    return response.data;
  },

  // Change password
  changePassword: async (
    currentPassword: string, 
    newPassword: string
  ): Promise<ApiResponse<{ changed: boolean }>> => {
    const response = await apiClient.post<ApiResponse<{ changed: boolean }>>(
      '/auth/change-password', 
      { currentPassword, newPassword }
    );
    return response.data;
  },

  // Delete account
  deleteAccount: async (password: string): Promise<ApiResponse<{ deleted: boolean }>> => {
    const response = await apiClient.delete<ApiResponse<{ deleted: boolean }>>(
      '/auth/account', 
      { data: { password } }
    );
    return response.data;
  },
};
