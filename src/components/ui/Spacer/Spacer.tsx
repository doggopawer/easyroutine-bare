// src/shared/layout/Spacer.tsx
// 기능: 남는 공간을 채우는 유연한 공간 컴포넌트

import React from 'react';
import { View, ViewStyle } from 'react-native';

type Props = {
  flex?: number; // 기본 1
  style?: ViewStyle | ViewStyle[];
};

export const Spacer: React.FC<Props> = ({ flex = 1, style }) => {
  return <View style={[{ flex }, style]} />;
};
