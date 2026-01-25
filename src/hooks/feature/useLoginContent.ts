import { useCallback } from 'react';

export const useLoginContent = () => {
  const login = useCallback(() => {
    console.log('Login pressed');
  }, []);

  return {
    login,
  };
};
