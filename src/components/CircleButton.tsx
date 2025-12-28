// CircleButton.tsx
import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider/ThemeProvider';

type CircleButtonProps = {
  children: React.ReactNode;
  width: number;
  height: number;
  onCircleButtonClick?: () => void;
};

const CircleButton: React.FC<CircleButtonProps> = ({
  children,
  width,
  height,
  onCircleButtonClick,
}) => {
  const { theme } = useTheme();

  const wrapperStyle: ViewStyle = {
    width,
    height,
    minWidth: width,
    borderRadius: Math.min(width, height) / 2,
    backgroundColor: theme.colors.primary1,
  };

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onCircleButtonClick}
      style={[styles.wrapper, wrapperStyle]}
    >
      {typeof children === 'string' ? <Text style={styles.label}>{children}</Text> : children}
    </Pressable>
  );
};

export default CircleButton;

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  label: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
