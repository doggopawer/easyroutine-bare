// styled.d.ts  (루트에 위치)
// ⚠️ 'styled-components' 에 반드시 보강. RN에서 드물게 'native' 쪽을 요구하는 경우가 있어 둘 다 보강.

import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    name: 'light' | 'dark';
    colors: {
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
