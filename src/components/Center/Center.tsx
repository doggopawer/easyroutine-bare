// src/shared/layout/Center.tsx
import React from 'react';
import type { StackPropsBase } from '../shared/layout/types';
import { StackView } from '../shared/layout/StackBase';
import { applyGapFallback } from '../shared/layout/utils';

// align/justify 고정. 나머지 공통 옵션은 유지
export const Center: React.FC<Omit<StackPropsBase, 'align' | 'justify' | 'wrap'>> = ({
  children,
  gap,
  padding,
  width,
  height,
  flex,
  style,
}) => {
  return (
    <StackView
      $dir="column"
      $align="center"
      $justify="center"
      $wrap="nowrap"
      $gap={gap}
      $padding={padding}
      $width={width}
      $height={height}
      $flex={flex}
      style={style}
    >
      {applyGapFallback(children, gap, 'column')}
    </StackView>
  );
};
