import { useCallback } from 'react';

export const useLoginScreen = () => {
  const handleLogin = useCallback(() => {
    console.log('Login pressed');
  }, []);

  return {
    handleLogin,
  };
};
