// 파일: shared/headless/manySelect/ManySelectDisplay.tsx
// 목적: ManySelect 현재 선택값 표시

import React from 'react';
import type { ViewProps } from 'react-native';
import { View } from 'react-native';
import { useManySelectStore, useManySelectStoreContext } from './ManySelectContext';

export type ManySelectDisplayProps = ViewProps & {
  render?: (values: string[]) => React.ReactNode;
};

const ManySelectDisplay: React.FC<ManySelectDisplayProps> = ({ render, ...props }) => {
  const store = useManySelectStoreContext();
  const values = useManySelectStore(store, s => s.values);

  return <View {...props}>{render ? render(values) : null}</View>;
};

export default ManySelectDisplay;
