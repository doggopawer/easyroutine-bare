// src/shared/layout/Divider.tsx
// 기능: 가로/세로 구분선. theme.colors.border 사용(없으면 기본값)

import React from 'react';
import { View, ViewStyle } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider/ThemeProvider';

type Props = {
  orientation?: 'horizontal' | 'vertical';
  size?: number; // 두께
  length?: number | string; // 길이 (예: '100%' or 200)
  color?: string; // 없으면 theme.colors.border
  style?: ViewStyle | ViewStyle[];
};

export const Divider: React.FC<Props> = ({
  orientation = 'horizontal',
  size = 1,
  length = '100%',
  color,
  style,
}) => {
  const { theme } = useTheme();
  const finalColor = color ?? theme.colors.border;

  const baseStyle: ViewStyle = {
    backgroundColor: finalColor,
  };

  if (orientation === 'vertical') {
    baseStyle.width = size;
    baseStyle.height = typeof length === 'number' ? length : (length as any);
  } else {
    baseStyle.height = size;
    baseStyle.width = typeof length === 'number' ? length : (length as any);
  }

  return <View style={[baseStyle, style]} />;
};
