// src/shared/layout/HStack.tsx
import React from 'react';
import type { StackPropsBase } from './types';
import { StackView } from './StackBase';
import { applyGapFallback } from './utils';

export const HStack: React.FC<StackPropsBase> = ({
  children,
  gap,
  align = 'center',
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
      $dir="row"
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
      {applyGapFallback(children, gap, 'row')}
    </StackView>
  );
};
