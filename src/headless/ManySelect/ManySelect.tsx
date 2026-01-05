// 파일: shared/headless/manySelect/ManySelect.tsx
// 목적: Headless ManySelect Root (Provider)
// - 여러 개 선택 가능한 Select
// - zustand store 기반
// - controlled/uncontrolled 지원

import type { ReactNode } from 'react';
import React, { useEffect, useMemo } from 'react';
import { createManySelectStore, ManySelectStoreProvider } from './ManySelectContext';
import ManySelectItem from './ManySelectItem';
import ManySelectDisplay from './ManySelectDisplay';

export type ManySelectProps = {
  children: ReactNode;
  defaultValue?: string[]; // ✅ uncontrolled 초기값
  value?: string[]; // ✅ controlled value
  onChange?: (value: string[]) => void; // ✅ 변경 콜백
};

const ManySelectRoot: React.FC<ManySelectProps> = ({
  children,
  defaultValue = [],
  value,
  onChange,
}) => {
  const store = useMemo(
    () => createManySelectStore(defaultValue, onChange),
    [defaultValue, onChange]
  );

  const isControlled = value !== undefined;

  useEffect(() => {
    if (!isControlled) return;
    store.getState().setValues(value as string[]);
  }, [isControlled, store, value]);

  return <ManySelectStoreProvider value={store}>{children}</ManySelectStoreProvider>;
};

export const ManySelect = Object.assign(ManySelectRoot, {
  Item: ManySelectItem,
  Display: ManySelectDisplay,
});

export default ManySelect;
