// src/navigation/stacks/AppNavigator.tsx
// 기능: 로그인 이후 스택

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DetailScreen from '@/features/app/screens/DetailScreen';
import HomeScreen from '@/features/app/screens/HomeScreen';
import { AppStackParamList } from './types';


const Stack = createNativeStackNavigator<AppStackParamList>();

export const AppNavigator: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: '홈' }} />
      <Stack.Screen name="Detail" component={DetailScreen} options={{ title: '상세' }} />
    </Stack.Navigator>
  );
};