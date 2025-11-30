// src/shared/layout/StackBase.tsx
import styled from 'styled-components/native';
import { mapAlign, mapJustify, numOrStr, paddingToStyle } from './utils';
import type { PaddingSize, Align, Justify, Wrap } from './types';

export const StackView = styled.View<{
  $dir: 'row' | 'column';
  $align?: Align;
  $justify?: Justify;
  $wrap?: Wrap;
  $gap?: number;
  $width?: number | string;
  $height?: number | string;
  $padding?: PaddingSize;
  $flex?: number;
}>`
  flex-direction: ${({ $dir }) => $dir};
  align-items: ${({ $align }) => mapAlign($align)};
  justify-content: ${({ $justify }) => mapJustify($justify)};
  flex-wrap: ${({ $wrap }) => $wrap ?? 'nowrap'};
  ${({ $gap }) => ($gap != null ? `gap: ${$gap}px;` : '')}
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
