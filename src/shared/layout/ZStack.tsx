// src/shared/layout/ZStack.tsx
// 기능: 겹쳐 쌓기(오버레이). 기본은 자식들을 동일 컨테이너 기준으로 겹침.
// align/justify는 컨테이너 내부에서 중앙/시작/끝 정렬 컨트롤.

import React from 'react';
import styled from 'styled-components/native';
import type { ViewStyle } from 'react-native';
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

const Root = styled.View<{
  $align?: Align;
  $justify?: Justify;
  $padding?: PaddingSize;
  $width?: number | string;
  $height?: number | string;
  $flex?: number;
}>`
  position: relative;
  align-items: ${({ $align }) => mapAlign($align)};
  justify-content: ${({ $justify }) => mapJustify($justify)};
  ${({ $width }) => ($width != null ? `width: ${numOrStr($width)};` : '')}
  ${({ $height }) => ($height != null ? `height: ${numOrStr($height)};` : '')}
  ${({ $flex }) => ($flex != null ? `flex: ${$flex};` : '')}
  ${({ $padding }) => {
    const p = paddingToStyle($padding);
    return `
      padding-top: ${p.paddingTop ?? 0}px;
      padding-right: ${p.paddingRight ?? 0}px;
      padding-bottom: ${p.paddingBottom ?? 0}px;
      padding-left: ${p.paddingLeft ?? 0}px;
    `;
  }}
`;

// 자식이 absolute가 아니어도 자동으로 덮일 수 있도록, 내부 래퍼로 채움
const Fill = styled.View`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`;

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
  return (
    <Root
      $align={align}
      $justify={justify}
      $padding={padding}
      $width={width}
      $height={height}
      $flex={flex}
      style={style}
    >
      {nodes.map((node, i) => (
        <Fill key={i}>{node as React.ReactNode}</Fill>
      ))}
    </Root>
  );
};
