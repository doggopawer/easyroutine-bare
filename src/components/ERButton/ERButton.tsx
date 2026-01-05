import React, { useMemo } from 'react';
import { Pressable, Text, StyleSheet, ViewStyle, TextStyle, PressableProps } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider/ThemeProvider';

/* -------------------------------------------------------------------------- */
/*                                   ✅ 타입 정의                                */
/* -------------------------------------------------------------------------- */

// ✅ 지금은 확장 대비용으로만 존재 (현재는 동일 스타일)
export type ERButtonVariant = 'solid';

type Props = {
  variant?: ERButtonVariant; // ✅ 확장 대비용
  disabled?: boolean;
  children: React.ReactNode;

  // ✅ style 확장 포인트
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

  /* -------------------------------------------------------------------------- */
  /*                              ✅ variant 별 스타일                             */
  /* -------------------------------------------------------------------------- */

  const backgroundColor = useMemo(() => {
    // ✅ 지금은 solid만 존재하지만, 추후 ghost/outline 등을 추가할 수 있음
    if (variant === 'solid') return theme.colors.primary1;
    return theme.colors.primary1;
  }, [variant, theme.colors.primary1]);

  /* -------------------------------------------------------------------------- */
  /*                                   ✅ 렌더링                                  */
  /* -------------------------------------------------------------------------- */

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      style={[styles.wrapper, { backgroundColor, opacity: disabled ? 0.5 : 1 }, containerStyle]}
      {...props}
    >
      {typeof children === 'string' ? (
        <Text style={[styles.label, { color: theme.colors.white1 }, labelStyle]}>{children}</Text>
      ) : (
        children
      )}
    </Pressable>
  );
};

export default ERButton;

/* -------------------------------------------------------------------------- */
/*                                    ✅ 스타일                                  */
/* -------------------------------------------------------------------------- */

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    height: 40,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
});
