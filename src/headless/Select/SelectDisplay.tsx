// 파일: shared/headless/select/SelectDisplay.tsx
// 목적: Select 현재 선택값 표시

import React from 'react';
import type { ViewProps } from 'react-native';
import { View } from 'react-native';
import { useSelectStore, useSelectStoreContext } from './SelectContext';

export type SelectDisplayProps = ViewProps & {
  render?: (value: string) => React.ReactNode;
};

const SelectDisplay: React.FC<SelectDisplayProps> = ({ render, ...props }) => {
  const store = useSelectStoreContext();
  const value = useSelectStore(store, s => s.value);

  return <View {...props}>{render ? render(value) : null}</View>;
};

export default SelectDisplay;
