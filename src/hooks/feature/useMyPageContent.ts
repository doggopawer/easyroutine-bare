import { useCallback } from 'react';
import { Alert } from 'react-native';

export const useMyPageContent = () => {
  const toggle = useCallback(() => {
    // Toggle logic
  }, []);

  const pressCircleButton = useCallback(() => {
    console.log('click');
  }, []);

  const pressTabItem = useCallback((v: string) => {
    Alert.alert('click', v);
  }, []);

  return {
    toggle,
    pressCircleButton,
    pressTabItem,
  };
};
