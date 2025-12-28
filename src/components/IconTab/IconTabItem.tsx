// IconTabItem.tsx
import React, { memo, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import Select from '@/headless/Select/Select';
import { useSelectStore, useSelectStoreContext } from '@/headless/Select/SelectContext';
import { useTheme } from '@/theme/ThemeProvider/ThemeProvider';

type IconTabItemProps = {
  value: string;
  children: React.ReactNode;
  onTabItemPress?: (value: string) => void;
  disabled?: boolean;
  accessibilityLabel?: string;
};

const IconTabItemBase: React.FC<IconTabItemProps> = ({
  value,
  children,
  onTabItemPress,
  disabled,
  accessibilityLabel,
}) => {
  const store = useSelectStoreContext();
  const active = useSelectStore(store, s => s.isSelected(value));
  const { theme } = useTheme();

  const columnStyle: ViewStyle = useMemo(
    () => ({
      opacity: disabled ? 0.5 : 1,
    }),
    [disabled]
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
      style={{ flex: 1 }}
    >
      <View style={[styles.column, columnStyle]}>
        {typeof children === 'string' ? (
          <Text
            style={[
              styles.content,
              {
                fontWeight: active ? '700' : '400',
                color: active ? theme.colors.primary1 : theme.colors.gray3,
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

export default memo(IconTabItemBase);

const styles = StyleSheet.create({
  column: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    fontSize: 14,
  },
});
