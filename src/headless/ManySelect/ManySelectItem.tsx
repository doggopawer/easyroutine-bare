// 파일: shared/headless/manySelect/ManySelectItem.tsx
// 목적: ManySelect 개별 항목
// - Pressable 기반
// - 클릭 시 toggle

import React, { memo, useCallback } from 'react';
import type { PressableProps } from 'react-native';
import { Pressable } from 'react-native';
import { useManySelectStore, useManySelectStoreContext } from './ManySelectContext';

export type ManySelectItemProps = Omit<PressableProps, 'onPress'> & {
  value: string;
  children?: React.ReactNode;
  onPress?: (value: string) => void;
};

const ManySelectItemBase: React.FC<ManySelectItemProps> = ({
  value,
  children,
  onPress,
  ...props
}) => {
  const store = useManySelectStoreContext();

  const selected = useManySelectStore(store, s => s.isSelected(value));
  const toggleValue = useManySelectStore(store, s => s.toggleValue);

  const press = useCallback(() => {
    toggleValue(value);
    onPress?.(value);
  }, [toggleValue, value, onPress]);

  return (
    <Pressable
      {...props}
      onPress={press}
      accessibilityRole="checkbox"
      accessibilityState={{
        checked: selected,
        disabled: !!props.disabled,
      }}
    >
      {children}
    </Pressable>
  );
};

export default memo(ManySelectItemBase);
