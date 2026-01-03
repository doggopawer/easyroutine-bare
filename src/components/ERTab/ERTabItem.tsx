// 파일: shared/headful/ERTab/ERTabItem.tsx
// 목적: ERTab.Item
// - Select.Item 기반
// - variant별 UI 분기 (chip / color / icon)
// - active 여부는 zustand selector로 최소 구독

import React, { memo, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import Select from '@/headless/Select/Select';
import { useSelectStore, useSelectStoreContext } from '@/headless/Select/SelectContext';
import { useTheme } from '@/theme/ThemeProvider/ThemeProvider';
import { useERTabContext } from './ERTab';

type ERTabItemProps = {
  value: string;
  label?: string;
  children?: React.ReactNode;
  disabled?: boolean;
  accessibilityLabel?: string;
  isLast?: boolean;
  onTabItemPress?: (value: string) => void;
};

const ERTabItemBase: React.FC<ERTabItemProps> = ({
  value,
  label,
  children,
  disabled,
  accessibilityLabel,
  isLast = false,
  onTabItemPress,
}) => {
  const { theme } = useTheme();
  const store = useSelectStoreContext();
  const active = useSelectStore(store, s => s.isSelected(value));
  const { variant } = useERTabContext();

  const handlePress = useCallback(
    (v: string) => {
      onTabItemPress?.(v);
    },
    [onTabItemPress]
  );

  /* -------------------------------------------------------------------------- */
  /*                               ✅ CHIP 스타일                                */
  /* -------------------------------------------------------------------------- */

  const chipStyle: ViewStyle = useMemo(
    () => ({
      borderColor: active ? theme.colors.primary1 : theme.colors.gray4,
      backgroundColor: active ? theme.colors.primary1 : 'transparent',
      opacity: disabled ? 0.5 : 1,
      marginRight: isLast ? 0 : 10,
    }),
    [active, theme.colors.primary1, theme.colors.gray4, disabled, isLast]
  );

  /* -------------------------------------------------------------------------- */
  /*                               ✅ COLOR 스타일                               */
  /* -------------------------------------------------------------------------- */

  const colorBg = useMemo(() => {
    if (variant !== 'color') return '#999999';
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
  }, [value, variant]);

  const dotStyle: ViewStyle = useMemo(
    () => ({
      backgroundColor: colorBg,
      borderWidth: active ? 5 : 0,
      borderColor: theme.colors.primary1,
      opacity: disabled ? 0.5 : 1,
    }),
    [colorBg, active, theme.colors.primary1, disabled]
  );

  /* -------------------------------------------------------------------------- */
  /*                               ✅ ICON 스타일                                */
  /* -------------------------------------------------------------------------- */

  const iconStyle: ViewStyle = useMemo(
    () => ({
      opacity: disabled ? 0.5 : 1,
      flex: 1,
    }),
    [disabled]
  );

  /* -------------------------------------------------------------------------- */
  /*                               ✅ LINE 스타일                                */
  /* -------------------------------------------------------------------------- */

  const lineStyle: ViewStyle = useMemo(
    () => ({
      borderBottomColor: active ? theme.colors.primary1 : 'transparent',
      opacity: disabled ? 0.5 : 1,
    }),
    [active, theme.colors.primary1, disabled]
  );

  return (
    <Select.Item
      value={value}
      disabled={disabled}
      accessibilityLabel={accessibilityLabel ?? label}
      onPress={handlePress}
      style={variant === 'icon' ? { flex: 1 } : undefined}
    >
      {variant === 'chip' && (
        <View style={[styles.chipContainer, chipStyle]}>
          <Text
            style={[
              styles.chipText,
              {
                fontWeight: active ? 'bold' : '400',
                color: active ? theme.colors.white1 : theme.colors.textMuted,
              },
            ]}
          >
            {label ?? value}
          </Text>
        </View>
      )}

      {variant === 'color' && <View style={[styles.colorDot, dotStyle]} />}

      {variant === 'icon' && (
        <View style={[styles.iconColumn, iconStyle]}>
          {typeof children === 'string' ? (
            <Text
              style={[
                styles.iconText,
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
      )}

      {variant === 'line' && (
        <View style={[styles.lineArea, lineStyle]}>
          {typeof children === 'string' ? (
            <Text
              style={[
                styles.lineText,
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
      )}
    </Select.Item>
  );
};

export default memo(ERTabItemBase);

const styles = StyleSheet.create({
  chipContainer: {
    minWidth: 50,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipText: {
    fontSize: 14,
  },

  colorDot: {
    width: 25,
    height: 25,
    borderRadius: 999,
  },

  iconColumn: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 14,
  },

  lineArea: {
    width: '100%',
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
  },
  lineText: {
    fontSize: 14,
  },
});
