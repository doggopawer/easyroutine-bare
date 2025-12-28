// 파일: components/ChipTab/ChipTabItem.tsx
// 목적: ChipTab에서 사용하는 Select.Item 래퍼
// - SelectStoreContext 기반 zustand selector 구독
// - value 선택 여부(active)만 구독하여 리렌더 최소화
// - 기존 UI/동작 유지

import React, { useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider/ThemeProvider';

// ✅ 반드시 Select 최종 Root를 import 해야 Object.assign(Item) 접근 가능
import Select from '@/headless/Select/Select';

// ✅ zustand store selector 접근 (final Select 구조)
import { useSelectStore, useSelectStoreContext } from '@/headless/Select/SelectContext';

type ChipTabItemProps = {
  value: string;
  label: string;
  onTabItemPress?: (value: string) => void;
  disabled?: boolean;
  accessibilityLabel?: string;
  isLast?: boolean;
};

const ChipTabItem: React.FC<ChipTabItemProps> = ({
  value,
  label,
  onTabItemPress,
  disabled,
  accessibilityLabel,
  isLast = false,
}) => {
  const { theme } = useTheme();

  // ✅ store 주입 받기
  const store = useSelectStoreContext();

  // ✅ 선택 여부만 selector로 구독 (리렌더 최소화)
  const active = useSelectStore(store, s => s.isSelected(value));

  const containerStyle: ViewStyle = useMemo(
    () => ({
      borderColor: active ? theme.colors.primary1 : theme.colors.gray4,
      backgroundColor: active ? theme.colors.primary1 : 'transparent',
      opacity: disabled ? 0.5 : 1,
      marginRight: isLast ? 0 : 10,
    }),
    [active, theme.colors.primary1, theme.colors.gray4, disabled, isLast]
  );

  const handlePress = useCallback(
    (v: string) => {
      onTabItemPress?.(v);
    },
    [onTabItemPress]
  );

  return (
    <Select.Item
      value={value}
      disabled={disabled}
      accessibilityLabel={accessibilityLabel ?? label}
      onPress={handlePress}
    >
      <View style={[styles.container, containerStyle]}>
        <Text
          style={[
            styles.text,
            {
              fontWeight: active ? 'bold' : '400',
              color: active ? theme.colors.white1 : theme.colors.textMuted,
            },
          ]}
        >
          {label}
        </Text>
      </View>
    </Select.Item>
  );
};

export default ChipTabItem;

const styles = StyleSheet.create({
  container: {
    minWidth: 50,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 14,
  },
});
