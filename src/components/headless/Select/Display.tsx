// 파일: shared/headless/select/components/Display/Display.tsx
// 목적: Headless Select의 현재 선택값을 표시하는 Display (React Native)
// - render prop 유지
// - RN에서는 div 대신 View 사용
// - 스타일/레이아웃은 외부에서 styled(View)로 감싸서 적용

import React from 'react';
import type { ViewProps } from 'react-native';
import { View } from 'react-native';
import { useSelect } from './Select';

type SelectGroupDisplayProps = ViewProps & {
  render?: (value: string) => React.ReactNode;
};

export const Display: React.FC<SelectGroupDisplayProps> = ({ render, ...props }) => {
  const { selectValue } = useSelect();
  return <View {...props}>{render ? render(selectValue) : null}</View>;
};
