import React, { useMemo } from 'react';
import { Pressable, Text, StyleSheet, ViewStyle, TextStyle, PressableProps } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider/ThemeProvider';

export type ERButtonVariant = 'solid';

type Props = {
  variant?: ERButtonVariant;
  disabled?: boolean;
  children: React.ReactNode;

  containerStyle?: ViewStyle;
  labelStyle?: TextStyle;
} & Omit<PressableProps, 'style' | 'children'>;

const ERButton: React.FC<Props> = ({
  variant = 'solid',
  disabled = false,
  children,
  containerStyle,
  labelStyle,
  ...props
}) => {
  const { theme } = useTheme();

  const backgroundColor = useMemo(() => {
    if (variant === 'solid') return theme.colors.primary1;
    return theme.colors.primary1;
  }, [variant, theme.colors.primary1]);

  return (
    <Pressable
      {...props} // ✅✅✅ 먼저 props를 펼친다 (이게 핵심)
      accessibilityRole="button"
      disabled={disabled} // ✅✅✅ disabled는 마지막에 고정
      style={({ pressed }) => [
        styles.wrapper,
        {
          backgroundColor,
          opacity: disabled ? 0.5 : pressed ? 0.85 : 1,
        },
        containerStyle,
      ]}
    >
      <Text style={[styles.label, { color: theme.colors.white1 }, labelStyle]}>{children}</Text>
    </Pressable>
  );
};

export default ERButton;

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
  },
});
