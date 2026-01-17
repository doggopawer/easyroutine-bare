import { useCallback } from 'react';
import { Alert } from 'react-native';

export const useMyPageScreen = () => {
  const handleToggleClick = useCallback(() => {
    // Toggle logic
  }, []);

  const handleCircleButtonClick = useCallback(() => {
    console.log('click');
  }, []);

  const handleTabItemPress = useCallback((v: string) => {
    Alert.alert('click', v);
  }, []);

  return {
    handleToggleClick,
    handleCircleButtonClick,
    handleTabItemPress,
  };
};
