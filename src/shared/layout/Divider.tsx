// src/shared/layout/Divider.tsx
// 기능: 가로/세로 구분선. theme.colors.border 사용(없으면 기본값)

import React from 'react';
import styled from 'styled-components/native';
import type { ViewStyle } from 'react-native';

type Props = {
  orientation?: 'horizontal' | 'vertical';
  size?: number; // 두께
  length?: number | string; // 길이 (예: '100%' or 200)
  color?: string; // 없으면 theme.colors.border
  style?: ViewStyle | ViewStyle[];
};

const Line = styled.View<Required<Pick<Props, 'orientation' | 'size' | 'length'>> & { $color: string }>`
  background-color: ${({ $color }) => $color};
  ${({ orientation, size, length }) =>
    orientation === 'vertical'
      ? `width: ${size}px; height: ${typeof length === 'number' ? `${length}px` : length};`
      : `height: ${size}px; width: ${typeof length === 'number' ? `${length}px` : length};`}
`;

export const Divider: React.FC<Props> = ({
  orientation = 'horizontal',
  size = 1,
  length = '100%',
  color,
  style,
}) => {
  return (
    <Line
      orientation={orientation}
      size={size}
      length={length}
      $color={color ?? '#E5E5E5'}
      style={style}
    />
  );
};