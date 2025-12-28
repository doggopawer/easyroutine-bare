import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider/ThemeProvider';

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  disabled?: boolean;
};

const BaseInput: React.FC<Props> = ({
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  disabled,
}) => {
  const { theme } = useTheme();

  return (
    <View style={styles.wrapper}>
      <TextInput
        style={[styles.input, { color: theme.colors.text }]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        editable={!disabled}
        placeholderTextColor="#999"
      />
    </View>
  );
};

export default BaseInput;

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#c7ccd1',
    paddingHorizontal: 12,
    height: 40,
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    fontSize: 14,
  },
});
