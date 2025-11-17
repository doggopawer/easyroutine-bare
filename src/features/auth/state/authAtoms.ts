import { atom, AtomEffect } from 'recoil';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '@/shared/types';

// 공통 persist 함수 (AsyncStorage 자동 연동)
const persist =
  <T,>(key: string): AtomEffect<T> =>
  ({ setSelf, onSet }) => {
    (async () => {
      const saved = await AsyncStorage.getItem(key);
      if (saved != null) setSelf(JSON.parse(saved) as T);
    })();

    onSet(async (val, _, isReset) => {
      if (isReset) await AsyncStorage.removeItem(key);
      else await AsyncStorage.setItem(key, JSON.stringify(val));
    });
  };

export const userAtom = atom<User | null>({
  key: 'auth/user',
  default: null,
  effects: [persist<User | null>('auth_user')],
});

export const accessTokenAtom = atom<string | null>({
  key: 'auth/access',
  default: null,
  effects: [persist<string | null>('auth_access')],
});

export const refreshTokenAtom = atom<string | null>({
  key: 'auth/refresh',
  default: null,
  effects: [persist<string | null>('auth_refresh')],
});