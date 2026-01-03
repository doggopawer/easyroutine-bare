import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider/ThemeProvider';

type Props = {
  onPress?: () => void;
  disabled?: boolean;
  children: React.ReactNode;
};

const ERButton: React.FC<Props> = ({ onPress, disabled, children }) => {
  const { theme } = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.wrapper,
        { backgroundColor: theme.colors.primary1, opacity: disabled ? 0.5 : 1 },
      ]}
    >
      {typeof children === 'string' ? (
        <Text style={[styles.label, { color: theme.colors.white1 }]}>{children}</Text>
      ) : (
        children
      )}
    </Pressable>
  );
};

export default ERButton;

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
