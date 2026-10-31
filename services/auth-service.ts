import { http } from '@/lib/axios';
import { ApiResponse, AuthPaylaod, AuthResponse, RegisterPayload, UserResponse } from '@/types';

export const authService = {
  login: async (credential: AuthPaylaod): Promise<ApiResponse<AuthResponse>> => {
    return await http.post('/auth/login', credential);
  },
  register: async (payload: RegisterPayload): Promise<ApiResponse<AuthResponse>> => {
    return await http.post('/auth/register', payload);
  },
  me: async (): Promise<ApiResponse<UserResponse>> => {
    return await http.get('/auth/me');
  },
  updateProfile: async (payload: { name: string }): Promise<ApiResponse<UserResponse>> => {
    return await http.patch('/auth/profile', payload);
  },
  updatePassword: async (payload: {
    current_password: string;
    password: string;
    password_confirmation: string;
  }): Promise<ApiResponse<null>> => {
    return await http.patch('/auth/password', payload);
  },
  logout: async (): Promise<ApiResponse<null>> => {
    return await http.post('/auth/logout');
  },
};
