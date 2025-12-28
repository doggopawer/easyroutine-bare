import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { HStack } from '@/shared/layout';
import { useTheme } from '@/theme/ThemeProvider/ThemeProvider';

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  onPressXMark?: () => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  disabled?: boolean;
};

const SearchInput: React.FC<Props> = ({
  value,
  onChangeText,
  onPressXMark,
  placeholder,
  secureTextEntry,
  disabled,
}) => {
  const { theme } = useTheme();

  return (
    <View style={styles.wrapper}>
      <HStack gap={8} align="center">
        <Feather name="search" size={14} color="#000" />
        <TextInput
          style={[styles.input, { color: theme.colors.text }]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          secureTextEntry={secureTextEntry}
          editable={!disabled}
          placeholderTextColor="#999"
        />
        {value.length > 0 && <Feather name="x" size={14} color="#000" onPress={onPressXMark} />}
      </HStack>
    </View>
  );
};

export default SearchInput;

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 14,
    height: 44,
    justifyContent: 'center',
    backgroundColor: '#f2f2f2', // Gray background
  },
  input: {
    flex: 1,
    fontSize: 14,
    padding: 0, // Reset padding for TextInput inside HStack
  },
});
