// src/shared/layout/types.ts
import type { ViewStyle } from 'react-native';

export type PaddingSize =
  | number
  | {
      x?: number;
      y?: number;
      l?: number;
      r?: number;
      t?: number;
      b?: number;
    };

export type Align = 'stretch' | 'center' | 'start' | 'end' | 'flex-start' | 'flex-end' | 'baseline';

export type Justify =
  | 'start'
  | 'end'
  | 'center'
  | 'space-between'
  | 'space-around'
  | 'space-evenly'
  | 'flex-start'
  | 'flex-end';

export type Wrap = 'nowrap' | 'wrap' | 'wrap-reverse';

export type StackPropsBase = {
  children: React.ReactNode;
  gap?: number; // RN 최신은 gap 지원. 미지원 환경 폴백 처리됨
  align?: Align;
  justify?: Justify;
  wrap?: Wrap;
  padding?: PaddingSize;
  width?: number | string; // e.g., 320 | '100%'
  height?: number | string; // e.g., 200 | '100%'
  flex?: number; // flex 컨테이너로 쓰고 싶다면
  style?: ViewStyle | ViewStyle[];
};
