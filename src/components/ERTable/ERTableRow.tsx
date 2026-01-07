import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider/ThemeProvider';

type ERTableRowVariant = 'default' | 'active' | 'done';

type ERTableRowProps = {
  children: React.ReactNode;
  variant?: ERTableRowVariant;
  style?: ViewStyle;
};

const ERTableRow: React.FC<ERTableRowProps> = ({ children, variant = 'default', style }) => {
  const { theme } = useTheme();

  const variantStyle: ViewStyle =
    variant === 'active'
      ? { backgroundColor: theme.colors.primary4 }
      : variant === 'done'
      ? { backgroundColor: theme.colors.gray6 }
      : {};

  return <View style={[styles.row, variantStyle, style]}>{children}</View>;
};

export default ERTableRow;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12, // ✅ web border-spacing 느낌
    borderRadius: 12, // ✅ 배경색이 들어가면 둥글게
    paddingVertical: 4, // ✅ 배경색이 있을 때 좀 더 보기 좋게
    minHeight: 44,
  },
});
