// styled.d.ts  (루트에 위치)
// ⚠️ 'styled-components' 에 반드시 보강. RN에서 드물게 'native' 쪽을 요구하는 경우가 있어 둘 다 보강.

import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    name: 'light' | 'dark';
    colors: {
      // Grayscale
      white1: string;
      black1: string;
      gray1: string;
      gray2: string;
      gray3: string;
      gray4: string;
      gray5: string;
      gray6: string;
      gray7: string;

      // Brand / Accent
      blue1: string;
      blue2: string;

      // Status
      red1: string;
      red2: string;
      green1: string;
      green2: string;

      // Primary (Brand Orange)
      primary1: string;
      primary2: string;
      primary3: string;
      primary4: string;
      primary5: string;
      primary6: string;

      // Alpha Tokens
      primaryAlpha16: string;
      primaryAlpha24: string;

      // Gradients
      gradient1: string;
      gradient2: string;

      // Backdrop
      backdropColor: string;
      backdropBlur: number;
      backdropWebkitBlur: number;

      // Legacy support
      background: string;
      surface: string;
      text: string;
      textMuted: string;
      primary: string;
      primaryText: string;
      border: string;
    };
  }
}

declare module 'styled-components/native' {
  // 일부 환경에서 native 모듈을 직접 보강해야 theme 추론이 잡힙니다.
  export interface DefaultTheme {
    name: 'light' | 'dark';
    colors: {
      // Grayscale
      white1: string;
      black1: string;
      gray1: string;
      gray2: string;
      gray3: string;
      gray4: string;
      gray5: string;
      gray6: string;
      gray7: string;

      // Brand / Accent
      blue1: string;
      blue2: string;

      // Status
      red1: string;
      red2: string;
      green1: string;
      green2: string;

      // Primary (Brand Orange)
      primary1: string;
      primary2: string;
      primary3: string;
      primary4: string;
      primary5: string;
      primary6: string;

      // Alpha Tokens
      primaryAlpha16: string;
      primaryAlpha24: string;

      // Gradients
      gradient1: string;
      gradient2: string;

      // Backdrop
      backdropColor: string;
      backdropBlur: number;
      backdropWebkitBlur: number;

      // Legacy support
      background: string;
      surface: string;
      text: string;
      textMuted: string;
      primary: string;
      primaryText: string;
      border: string;
    };
  }
}
