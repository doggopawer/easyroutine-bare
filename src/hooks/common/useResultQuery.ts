// src/shared/utils/query/useResultQuery.ts
import { useEffect } from 'react';
import { atom, useRecoilCallback } from 'recoil';
import { useQuery, type UseQueryOptions, type QueryKey } from '@tanstack/react-query';

export const unwrapResult = <T>(r: Result<T>): T => {
  if (!r?.ok || r.data == null) {
    const msg = r?.message ?? '요청을 처리하지 못했습니다.';
    throw new Error(msg);
  }
  return r.data;
};

export type Result<T> = {
  result: any;
  ok: boolean;
  data?: T;
  message: string;
};

// Ok 헬퍼: 데이터와 메시지를 같이 반환
export const Ok = <T>(data: T, msg = '성공'): Result<T> => ({
  result: (data as any)?.result ?? null,
  ok: true,
  data,
  message: msg,
});

// Err 헬퍼: 실패 메시지 반환
export const Err = (msg: string): Result<never> => ({
  result: null,
  ok: false,
  message: msg,
});

export type ResultErrorMap = Record<string, string>;

export const resultErrorMapState = atom<ResultErrorMap>({
  key: 'resultErrorMapState',
  default: {},
});

const normalizeKey = (key: QueryKey): string =>
  Array.isArray(key)
    ? key.map(v => String(typeof v === 'object' ? JSON.stringify(v) : v)).join(' | ')
    : String(key);

export const useResultErrorReporter = () =>
  useRecoilCallback(
    ({ set }) =>
      (params: { key: QueryKey; error?: unknown }) => {
        const k = normalizeKey(params.key);
        if (params.error) {
          const msg = params.error instanceof Error ? params.error.message : String(params.error);
          set(resultErrorMapState, prev => ({ ...prev, [k]: msg }));
        } else {
          set(resultErrorMapState, prev => {
            const next = { ...prev };
            delete next[k];
            return next;
          });
        }
      },
    []
  );

// Result 또는 일반 T 둘 다 허용
type MaybeResult<T> = Result<T> | T;
type ResultReturningFn<TData> = () => Promise<MaybeResult<TData>> | MaybeResult<TData>;

type UseResultQueryOptions<TData, TError = Error, TKey extends QueryKey = QueryKey> = Omit<
  UseQueryOptions<TData, TError, TData, TKey>,
  'queryFn'
> & {
  queryFn: ResultReturningFn<unknown>;
  /**
   * 기본값 false:
   *  - useQuery(Result<T>)와 동일하게 Result<T>를 그대로 반환
   * true:
   *  - queryFn이 Result<T>를 반환하면 unwrapResult로 T를 반환
   *  - queryFn이 T를 반환하면 그대로 T 반환
   */
  unwrap?: boolean;
};

const isResult = (v: unknown): v is Result<unknown> =>
  !!v && typeof v === 'object' && 'ok' in (v as Record<string, unknown>);

export const useResultQuery = <TData, TError = Error, TKey extends QueryKey = QueryKey>(
  options: UseResultQueryOptions<TData, TError, TKey>
) => {
  const { queryFn, queryKey, unwrap = true, ...rest } = options;
  const report = useResultErrorReporter();

  const q = useQuery<TData, TError, TData, TKey>({
    ...rest,
    queryKey,
    queryFn: async () => {
      const r = await queryFn(); // unknown
      if (unwrap) {
        if (isResult(r)) return unwrapResult(r) as TData; // Result<T> -> T
        return r as TData; // 이미 T인 경우
      }
      // unwrap=false: 기존 useQuery(Result<T>)와 동일하게 그대로 반환
      return r as TData;
    },
  });

  // v5: 상태 관찰로 에러 기록/성공 시 제거
  useEffect(() => {
    if (q.status === 'error') {
      report({ key: queryKey, error: q.error });
    } else if (q.status === 'success') {
      report({ key: queryKey });
    }
  }, [q.status, q.error, queryKey, report]);

  return q;
};
