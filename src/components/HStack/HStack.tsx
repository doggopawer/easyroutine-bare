// src/shared/layout/HStack.tsx
import { StackPropsBase } from '@/types/layout';
import React from 'react';
import { StackView } from '../StackBase/StackBase';
import { applyGapFallback } from '@/utils/layout';

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
