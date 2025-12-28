// 파일: shared/headless/select/SelectItem.tsx
// 목적: Select 개별 항목

import React, { memo, useCallback } from 'react';
import type { PressableProps } from 'react-native';
import { Pressable } from 'react-native';
import { useSelectStore, useSelectStoreContext } from './SelectContext';

export type SelectItemProps = Omit<PressableProps, 'onPress'> & {
  value: string;
  children?: React.ReactNode;
  onPress?: (value: string) => void;
};

const SelectItemBase: React.FC<SelectItemProps> = ({ value, children, onPress, ...props }) => {
  const store = useSelectStoreContext();

  const selected = useSelectStore(store, s => s.isSelected(value));
  const setValue = useSelectStore(store, s => s.setValue);

  const handlePress = useCallback(() => {
    setValue(value);
    onPress?.(value);
  }, [setValue, value, onPress]);

  return (
    <Pressable
      {...props}
      onPress={handlePress}
      accessibilityRole="radio"
      accessibilityState={{
        selected,
        disabled: !!props.disabled,
      }}
    >
      {children}
    </Pressable>
  );
};

export default memo(SelectItemBase);
