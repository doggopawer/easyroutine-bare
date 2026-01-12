// 파일: shared/headful/ERCheckbox/ERCheckbox.tsx
// 목적: ERTab처럼 variant 기반 Checkbox 그룹 컴포넌트
// - ManySelect(headless) 기반
// - variant를 Context로 전달하여 Item 스타일 분기
// - controlled/uncontrolled 지원

import React, { createContext, useContext, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import ManySelect from '@/headless/ManySelect/ManySelect';
import ERCheckboxItem from './ERCheckboxItem';

/* -------------------------------------------------------------------------- */
/*                                ✅ 타입 정의                                  */
/* -------------------------------------------------------------------------- */

export type ERCheckboxVariant = 'image-text' | 'text';

type ERCheckboxProps = {
  variant: ERCheckboxVariant; // ✅ 스타일 타입
  defaultValue?: string[]; // ✅ uncontrolled 초기값
  children: React.ReactNode; // ✅ Item들
  value?: string[]; // ✅ controlled value
  onChange?: (value: string[]) => void; // ✅ value 변경 콜백
};

type ERCheckboxComponent = React.FC<ERCheckboxProps> & {
  Item: typeof ERCheckboxItem;
};

type ERCheckboxContextValue = {
  variant: ERCheckboxVariant;
};

const ERCheckboxContext = createContext<ERCheckboxContextValue | null>(null);

export const useERCheckboxContext = () => {
  const ctx = useContext(ERCheckboxContext);
  if (!ctx) {
    throw new Error('[ERCheckbox] must be used within <ERCheckbox />');
  }
  return ctx;
};

const ERCheckboxRoot: React.FC<ERCheckboxProps> = ({
  variant,
  defaultValue = [],
  value,
  onChange,
  children,
}) => {
  const contextValue = useMemo(() => ({ variant }), [variant]);

  return (
    <ERCheckboxContext.Provider value={contextValue}>
      <ManySelect defaultValue={defaultValue} value={value} onChange={onChange}>
        <View style={styles.root}>{children}</View>
      </ManySelect>
    </ERCheckboxContext.Provider>
  );
};

const ERCheckbox = ERCheckboxRoot as ERCheckboxComponent;
ERCheckbox.Item = ERCheckboxItem;

export default ERCheckbox;

const styles = StyleSheet.create({
  root: {
    width: '100%',
    flexDirection: 'column',
  },
});
