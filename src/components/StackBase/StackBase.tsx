// src/shared/layout/StackBase.tsx
import React from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';
import { mapAlign, mapJustify, numOrStr, paddingToStyle } from '@/utils/layout';
import type { PaddingSize, Align, Justify, Wrap } from '@/types/layout';

type StackViewProps = ViewProps & {
  $dir: 'row' | 'column';
  $align?: Align;
  $justify?: Justify;
  $wrap?: Wrap;
  $gap?: number;
  $width?: number | string;
  $height?: number | string;
  $padding?: PaddingSize;
  $flex?: number;
};

export const StackView = ({
  $dir,
  $align,
  $justify,
  $wrap,
  $gap,
  $width,
  $height,
  $padding,
  $flex,
  style,
  ...props
}: StackViewProps) => {
  const p = paddingToStyle($padding);

  return (
    <View
      style={[
        {
          flexDirection: $dir,
          alignItems: mapAlign($align),
          justifyContent: mapJustify($justify),
          flexWrap: $wrap ?? 'nowrap',
          gap: $gap,
          width: $width != null ? (numOrStr($width) as any) : undefined,
          height: $height != null ? (numOrStr($height) as any) : undefined,
          flex: $flex,
          paddingTop: p.paddingTop,
          paddingRight: p.paddingRight,
          paddingBottom: p.paddingBottom,
          paddingLeft: p.paddingLeft,
        },
        style,
      ]}
      {...props}
    />
  );
};
