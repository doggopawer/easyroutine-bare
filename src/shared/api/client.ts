// src/shared/api/client.ts
// 기능: axios 인스턴스 + 토큰 헤더 자동 첨부 + 401 리프레시 재시도 (Axios v1 타입 안전)

import axios, { AxiosError, AxiosHeaders, InternalAxiosRequestConfig } from 'axios';
import { tokenManager } from './tokenManager';
import { authApi } from './authApi';

export const api = axios.create({
  baseURL: 'https://easyroutine.heykiwoung.com', // 서버 주소로 교체
  timeout: 15000,
});

// --- 요청 인터셉터: Authorization 자동 첨부 ---
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = tokenManager.getAccessToken();
  if (!token) return config;

  // headers를 AxiosHeaders로 “정규화” 한 뒤 set 사용
  const headers = AxiosHeaders.from(config.headers);
  headers.set('Authorization', `Bearer ${token}`);
  config.headers = headers;

  return config;
});

let isRefreshing = false;
let refreshQueue: Array<() => void> = [];

// --- 응답 인터셉터: 401 → refreshToken 재발급 후 재시도 ---
api.interceptors.response.use(
  res => res,
  async (error: AxiosError) => {
    const original = error.config as
      | (InternalAxiosRequestConfig & { _retry?: boolean })
      | undefined;
    if (!original || original._retry) return Promise.reject(error);

    if (error.response?.status === 401) {
      original._retry = true;

      const refreshToken = tokenManager.getRefreshToken();
      if (!refreshToken) {
        tokenManager.clear();
        return Promise.reject(error);
      }

      if (isRefreshing) {
        await new Promise<void>(resolve => refreshQueue.push(resolve));
      } else {
        isRefreshing = true;
        try {
          const { data } = await authApi.refresh(refreshToken);
          // 서버 응답 스키마: { accessToken, refreshToken }
          tokenManager.setTokens(data.accessToken, data.refreshToken);
        } catch {
          tokenManager.clear();
          return Promise.reject(error);
        } finally {
          isRefreshing = false;
          refreshQueue.forEach(ok => ok());
          refreshQueue = [];
        }
      }

      // 새 토큰으로 원 요청 헤더 갱신 후 재시도
      const newAccess = tokenManager.getAccessToken() ?? '';
      const retryHeaders = AxiosHeaders.from(original.headers);
      retryHeaders.set('Authorization', `Bearer ${newAccess}`);
      original.headers = retryHeaders;

      return api(original);
    }

    return Promise.reject(error);
  }
);
