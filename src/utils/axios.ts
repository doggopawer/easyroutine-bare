// 파일: src/api/axiosInstance.ts
// 목적: React Native 전용 axios 인스턴스
// - baseURL: ENV에서 가져오기
// - business 실패(success=false)면 BusinessError throw
// - 인증 만료(ERR-AUT001)는 mitt 이벤트로 알림

import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios';
import Config from 'react-native-config';
import mitt from 'mitt';

/* -------------------------------------------------------------------------- */
/*                                ✅ 환경 변수                                  */
/* -------------------------------------------------------------------------- */

const REAL_API = Config.API_URL;

if (!REAL_API) {
  console.warn('[axiosInstance] API_URL is not set (.env)');
}

/* -------------------------------------------------------------------------- */
/*                              ✅ Auth Event (mitt)                            */
/* -------------------------------------------------------------------------- */

export type AuthEvents = {
  AUTH_EXPIRED: undefined;
};

export const authEmitter = mitt<AuthEvents>();

/* -------------------------------------------------------------------------- */
/*                              ✅ 표준 응답 타입                                */
/* -------------------------------------------------------------------------- */

export type ApiResult = {
  success: boolean;
  code?: string;
  message?: string;
};

export type ApiEnvelope<T = unknown> = {
  result?: ApiResult;
  data?: T;
  [key: string]: unknown;
};

/* -------------------------------------------------------------------------- */
/*                              ✅ 커스텀 오류                                   */
/* -------------------------------------------------------------------------- */

export class BusinessError<T = unknown> extends Error {
  code?: string;
  status?: number;
  payload?: T;

  constructor(message: string, opts?: { code?: string; status?: number; payload?: T }) {
    super(message);
    this.name = 'BusinessError';
    this.code = opts?.code;
    this.status = opts?.status;
    this.payload = opts?.payload;
  }
}

/* -------------------------------------------------------------------------- */
/*                              ✅ 헬퍼 함수                                     */
/* -------------------------------------------------------------------------- */

const isBusinessFail = (res: AxiosResponse<ApiEnvelope<unknown>>): boolean => {
  const s = res.data?.result?.success;
  return typeof s === 'boolean' && s === false;
};

/* -------------------------------------------------------------------------- */
/*                               ✅ axios instance                              */
/* -------------------------------------------------------------------------- */

const axiosInstance: AxiosInstance = axios.create({
  baseURL: REAL_API,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

/* -------------------------------------------------------------------------- */
/*                             ✅ request interceptor                           */
/* -------------------------------------------------------------------------- */

axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
    return config;
  },
  error => Promise.reject(error)
);

/* -------------------------------------------------------------------------- */
/*                             ✅ response interceptor                          */
/* -------------------------------------------------------------------------- */

axiosInstance.interceptors.response.use(
  (res: AxiosResponse<ApiEnvelope<unknown>>) => {
    if (!isBusinessFail(res)) return res;

    const { status, data } = res;
    const code = data.result?.code;

    // ✅ 인증 만료 처리
    if (code === 'ERR-AUT001') {
      console.warn('[axios] AUTH expired detected');

      authEmitter.emit('AUTH_EXPIRED');

      return Promise.reject(
        new BusinessError('인증이 만료되었습니다. 다시 로그인해주세요.', {
          code,
          status,
          payload: data,
        })
      );
    }

    const msg =
      data.result?.message ??
      (typeof (data as { message?: string }).message === 'string'
        ? (data as { message?: string }).message
        : '요청이 실패했습니다.');

    return Promise.reject(
      new BusinessError(msg as string, {
        code,
        status,
        payload: data,
      })
    );
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
