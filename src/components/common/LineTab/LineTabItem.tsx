// LineTabItem.tsx
import React, { useMemo, memo, useCallback } from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import Select from '@/headless/Select/Select';
import { useSelectStore, useSelectStoreContext } from '@/headless/Select/SelectContext';
import { useTheme } from '@/theme/ThemeProvider/ThemeProvider';

type LineTabItemProps = {
  value: string;
  children: React.ReactNode;
  onTabItemPress?: (value: string) => void;
  disabled?: boolean;
  accessibilityLabel?: string;
};

const LineTabItemBase: React.FC<LineTabItemProps> = ({
  value,
  children,
  onTabItemPress,
  disabled,
  accessibilityLabel,
}) => {
  const store = useSelectStoreContext();
  const active = useSelectStore(store, s => s.isSelected(value));
  const { theme } = useTheme();

  const pressAreaStyle: ViewStyle = useMemo(
    () => ({
      borderBottomColor: active ? theme.colors.primary1 : 'transparent',
      opacity: disabled ? 0.5 : 1,
    }),
    [active, theme.colors.primary1, disabled]
  );

  const press = useCallback(
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
      onPress={press}
      style={{ flex: 1 }}
    >
      <View style={[styles.pressArea, pressAreaStyle]}>
        {typeof children === 'string' ? (
          <Text
            style={[
              styles.label,
              {
                fontWeight: active ? '700' : '400',
                color: active ? theme.colors.primary1 : theme.colors.text,
              },
            ]}
          >
            {children}
          </Text>
        ) : (
          children
        )}
      </View>
    </Select.Item>
  );
};

export default memo(LineTabItemBase);

const styles = StyleSheet.create({
  pressArea: {
    width: '100%',
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
  },
  label: {
    fontSize: 14,
  },
});
