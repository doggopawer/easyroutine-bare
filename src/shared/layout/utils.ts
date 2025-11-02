// src/shared/layout/utils.ts
import React from 'react';
import type { ViewStyle } from 'react-native';
import type { Align, Justify, PaddingSize } from './types';

export const mapAlign = (v?: Align): NonNullable<ViewStyle['alignItems']> => {
  if (!v) return 'stretch';
  if (v === 'start') return 'flex-start';
  if (v === 'end') return 'flex-end';
  return v as NonNullable<ViewStyle['alignItems']>;
};

export const mapJustify = (v?: Justify): NonNullable<ViewStyle['justifyContent']> => {
  if (!v) return 'flex-start';
  if (v === 'start') return 'flex-start';
  if (v === 'end') return 'flex-end';
  return v as NonNullable<ViewStyle['justifyContent']>;
};

export const paddingToStyle = (
  p?: PaddingSize,
): Pick<ViewStyle, 'paddingTop' | 'paddingBottom' | 'paddingLeft' | 'paddingRight'> => {
  if (p == null) return {};
  if (typeof p === 'number') {
    return { paddingTop: p, paddingRight: p, paddingBottom: p, paddingLeft: p };
  }
  const x = p.x ?? 0;
  const y = p.y ?? 0;
  return {
    paddingTop: p.t ?? y,
    paddingBottom: p.b ?? y,
    paddingLeft: p.l ?? x,
    paddingRight: p.r ?? x,
  };
};

export const numOrStr = (v?: number | string): string | undefined => {
  if (v == null) return undefined;
  return typeof v === 'number' ? `${v}px` : v;
};

// gap 미지원 환경 폴백: 자식 margin으로 간격 보정
export const applyGapFallback = (
  children: React.ReactNode,
  gap: number | undefined,
  dir: 'row' | 'column',
) => {
  if (!gap || gap <= 0) return children;
  const isRow = dir === 'row';
  const validChildren = React.Children.toArray(children);

  return validChildren.map((child, idx) => {
    if (!React.isValidElement(child)) return child;

    const extraStyle: ViewStyle =
      idx === 0 ? {} : isRow ? { marginLeft: gap } : { marginTop: gap };

    const prevStyle = (child as React.ReactElement<any>).props?.style;

    const mergedStyle = Array.isArray(prevStyle)
      ? [...(prevStyle as ViewStyle[]), extraStyle]
      : [((prevStyle as ViewStyle) ?? {}), extraStyle];

    return React.cloneElement(child as React.ReactElement<any>, { style: mergedStyle });
  });
};