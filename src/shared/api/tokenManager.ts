// src/shared/api/tokenManager.ts

type Tokens = { accessToken: string | null; refreshToken: string | null };
type Listener = (tokens: Tokens) => void;

let accessToken: string | null = null;
let refreshToken: string | null = null;
const listeners = new Set<Listener>();

export const tokenManager = {
  getAccessToken: () => accessToken,
  getRefreshToken: () => refreshToken,

  setTokens: (access: string | null, refresh: string | null) => {
    accessToken = access;
    refreshToken = refresh;
    listeners.forEach((l) => l({ accessToken, refreshToken }));
  },

  clear: () => {
    accessToken = null;
    refreshToken = null;
    listeners.forEach((l) => l({ accessToken: null, refreshToken: null }));
  },

  subscribe: (l: Listener) => {
    listeners.add(l);
    return () => listeners.delete(l);
  },
};