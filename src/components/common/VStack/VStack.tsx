// src/shared/layout/VStack.tsx
import React from 'react';
import type { StackPropsBase } from '@/types/layout';
import { applyGapFallback } from '@/utils/layout';
import { StackView } from '../StackBase/StackBase';

export const VStack: React.FC<StackPropsBase> = ({
  children,
  gap,
  align,
  justify,
  wrap = 'nowrap',
  padding,
  width,
  height,
  flex,
  style,
}) => {
  return (
    <StackView
      $dir="column"
      $align={align}
      $justify={justify}
      $wrap={wrap}
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
