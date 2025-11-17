// src/features/auth/hooks/useAuth.ts
import { useCallback, useEffect } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { userAtom, accessTokenAtom, refreshTokenAtom } from '@/features/auth/state/authAtoms';
import { tokenManager } from '@/shared/api/tokenManager';
import type { User } from '@/shared/types';

export const useAuth = () => {
  const [user, setUser] = useRecoilState(userAtom);
  const [accessToken, setAccess] = useRecoilState(accessTokenAtom);
  const [refreshToken, setRefresh] = useRecoilState(refreshTokenAtom);

  useEffect(() => {
    tokenManager.setTokens(accessToken, refreshToken);
  }, [accessToken, refreshToken]);

  const setSession = useCallback(
    (u: User, a: string, r: string) => {
      setUser(u);
      setAccess(a);
      setRefresh(r);
      tokenManager.setTokens(a, r);
    },
    [setUser, setAccess, setRefresh]
  );

  const logout = useCallback(() => {
    setUser(null);
    setAccess(null);
    setRefresh(null);
    tokenManager.clear();
  }, [setUser, setAccess, setRefresh]);

  return { user, accessToken, refreshToken, setSession, logout };
};

export const useIsLoggedIn = (): boolean => {
  const user = useRecoilValue(userAtom);
  const token = useRecoilValue(accessTokenAtom);
  return !!(user && token);
};