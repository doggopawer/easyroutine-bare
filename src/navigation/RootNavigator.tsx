// src/navigation/RootNavigator.tsx
// 기능: 로그인 여부에 따라 AppNavigator / AuthNavigator 스위칭

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
// import { useIsLoggedIn } from '@/features/auth/hooks/useAuth';
import { AppNavigator } from './AppNavigator';
import { AuthNavigator } from './AuthNavigator';



export const RootNavigator: React.FC = () => {
  // const isLoggedIn = useIsLoggedIn();
  const isLoggedIn = true;

  return (
    <NavigationContainer>
      {isLoggedIn ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};