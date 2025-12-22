// 파일: shared/headless/select/components/Item/Item.tsx
// 목적: Headless Select의 개별 항목 (React Native)
// - 컨텍스트에서 changeSelectValue / isActive 사용
// - Pressable 기반, onPress로 선택 변경 + 콜백 체이닝
// - React.memo 적용

import React, { memo, useCallback } from 'react';
import type { PressableProps } from 'react-native';
import { Pressable } from 'react-native';
import { useSelect } from './Select';

export type SelectItemProps = Omit<PressableProps, 'onPress'> & {
  value: string;
  children?: React.ReactNode;
  onPress?: (value: string) => void;
};

const ItemBase: React.FC<SelectItemProps> = ({ value, children, onPress, ...props }) => {
  const { changeSelectValue, isActive } = useSelect();
  const active = isActive(value);

  const handlePress = useCallback(() => {
    changeSelectValue(value);
    onPress?.(value);
  }, [changeSelectValue, onPress, value]);

  return (
    <Pressable
      {...props}
      onPress={handlePress}
      accessibilityRole="radio"
      accessibilityState={{ selected: active, disabled: !!props.disabled }}
    >
      {children}
    </Pressable>
  );
};

const Item = memo(ItemBase);

export default Item;
