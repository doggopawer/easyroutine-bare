// ColorTabItem.tsx
import React, { useMemo, memo, useCallback } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Select from '@/headless/Select/Select';
import { useSelectStore, useSelectStoreContext } from '@/headless/Select/SelectContext';
import { useTheme } from '@/theme/ThemeProvider/ThemeProvider';

type ColorTabItemProps = {
  value: string;
  onTabItemPress?: (value: string) => void;
  disabled?: boolean;
  accessibilityLabel?: string;
};

const ColorTabItemBase: React.FC<ColorTabItemProps> = ({
  value,
  onTabItemPress,
  disabled,
  accessibilityLabel,
}) => {
  const store = useSelectStoreContext();
  const active = useSelectStore(store, s => s.isSelected(value));
  const { theme } = useTheme();

  const bgColor = useMemo(() => {
    switch (value) {
      case 'VIOLET':
        return '#855cf8';
      case 'ORANGE':
        return '#f26b2c';
      case 'GREEN':
        return '#2daf2d';
      case 'BLUE':
        return '#455a64';
      case 'PINK':
        return '#dd408f';
      default:
        return '#999999';
    }
  }, [value]);

  const dotStyle: ViewStyle = useMemo(
    () => ({
      backgroundColor: bgColor,
      borderWidth: active ? 5 : 0,
      borderColor: theme.colors.primary1,
    }),
    [bgColor, active, theme.colors.primary1]
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
      accessibilityLabel={accessibilityLabel}
      onPress={handlePress}
    >
      <View style={[styles.dot, dotStyle]} />
    </Select.Item>
  );
};

export default memo(ColorTabItemBase);

const styles = StyleSheet.create({
  dot: {
    width: 25,
    height: 25,
    borderRadius: 999,
  },
});
