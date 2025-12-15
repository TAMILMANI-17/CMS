import api from './api';
import { AuthResponse, SignupData, LoginData, UserProfile } from '@/src/types/auth.types';

export const authApi = {
  signup: async (data: SignupData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/signup', data);
    return response.data;
  },

  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', data);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
  },

  getProfile: async (): Promise<UserProfile> => {
    const response = await api.get<UserProfile>('/auth/profile');
    return response.data;
  },

  refreshToken: async (): Promise<{ accessToken: string }> => {
    const response = await api.post<{ accessToken: string }>('/auth/refresh');
    return response.data;
  },
};

