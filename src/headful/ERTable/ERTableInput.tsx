import React, { useCallback } from 'react';
import { Pressable, StyleSheet, TextInput, View, ViewStyle, TextInputProps } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider/ThemeProvider';

type ERTableInputProps = {
  value: string;
  isActive?: boolean;
  onChangeText?: (next: string) => void;
  onPress?: () => void;
  style?: ViewStyle;
  editable?: boolean;
  inputProps?: Omit<TextInputProps, 'value' | 'onChangeText' | 'editable'>;
};

const ERTableInput: React.FC<ERTableInputProps> = ({
  value,
  isActive,
  onChangeText,
  onPress,
  style,
  editable = true,
  inputProps,
}) => {
  const { theme } = useTheme();

  const handlePress = useCallback(() => {
    onPress?.();
  }, [onPress]);

  return (
    <Pressable style={[styles.wrapper, style]} onPress={handlePress}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        editable={editable}
        style={[styles.input, { color: theme.colors.text }]}
        placeholderTextColor={theme.colors.textMuted}
        textAlign="center"
        {...inputProps}
      />

      <View
        style={[
          styles.underline,
          {
            backgroundColor: isActive ? theme.colors.primary1 : theme.colors.gray4,
          },
        ]}
      />
    </Pressable>
  );
};

export default ERTableInput;

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },

  input: {
    width: '100%',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
    paddingVertical: 0,
    paddingHorizontal: 0,
  },

  underline: {
    width: 40,
    height: 3,
    borderRadius: 2,
  },
});
