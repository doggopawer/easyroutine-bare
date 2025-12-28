// src/shared/layout/ZStack.tsx
// 기능: 겹쳐 쌓기(오버레이). 기본은 자식들을 동일 컨테이너 기준으로 겹침.
// align/justify는 컨테이너 내부에서 중앙/시작/끝 정렬 컨트롤.

import React from 'react';
import { View, ViewStyle, StyleSheet } from 'react-native';
import type { Align, Justify, PaddingSize } from './types';
import { mapAlign, mapJustify, numOrStr, paddingToStyle } from './utils';

type ZStackProps = {
  children: React.ReactNode;
  align?: Align; // 가로 정렬 기준(alignItems)
  justify?: Justify; // 세로 정렬 기준(justifyContent)
  padding?: PaddingSize;
  width?: number | string;
  height?: number | string;
  flex?: number;
  style?: ViewStyle | ViewStyle[];
};

export const ZStack: React.FC<ZStackProps> = ({
  children,
  align = 'center',
  justify = 'center',
  padding,
  width,
  height,
  flex,
  style,
}) => {
  const nodes = React.Children.toArray(children);
  const p = paddingToStyle(padding);

  return (
    <View
      style={[
        {
          position: 'relative',
          alignItems: mapAlign(align),
          justifyContent: mapJustify(justify),
          width: width != null ? (numOrStr(width) as any) : undefined,
          height: height != null ? (numOrStr(height) as any) : undefined,
          flex: flex,
          paddingTop: p.paddingTop,
          paddingRight: p.paddingRight,
          paddingBottom: p.paddingBottom,
          paddingLeft: p.paddingLeft,
        },
        style,
      ]}
    >
      {nodes.map((node, i) => (
        <View key={i} style={StyleSheet.absoluteFill}>
          {node}
        </View>
      ))}
    </View>
  );
};
