// src/features/auth/api/authApi.ts
import { api } from '@/shared/api/client';

export const authApi = {
  login: async (email: string, password: string) => {
    const { data } = await api.post('/auth/login', { email, password });
    return data;
  },
  refresh: async (refreshToken: string) => {
    const { data } = await api.post('/auth/refresh', { refreshToken });
    return data; // { accessToken, refreshToken }
  },
};
