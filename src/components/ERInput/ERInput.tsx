import React, { useMemo } from 'react';
import { View, TextInput, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider/ThemeProvider';

/* -------------------------------------------------------------------------- */
/*                                   ✅ Types                                  */
/* -------------------------------------------------------------------------- */

/**
 * ✅ 지금은 default 하나만 지원
 * - 나중에 'search', 'filled' 같은 variant 추가하기 쉽게
 *   구조만 미리 만들어둔 상태
 */
export type ERInputVariant = 'default';

type ERInputProps = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  disabled?: boolean;

  /**
   * ✅ 확장 대비용 (지금은 default만)
   */
  variant?: ERInputVariant;

  /**
   * ✅ 스타일 확장 가능 (override)
   */
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
};

const ERInput: React.FC<ERInputProps> = ({
  value,
  onChangeText,
  placeholder = '',
  secureTextEntry = false,
  disabled = false,
  variant = 'default',
  containerStyle,
  inputStyle,
}) => {
  const { theme } = useTheme();

  /* -------------------------------------------------------------------------- */
  /*                          ✅ Variant Style (현재 1개만)                       */
  /* -------------------------------------------------------------------------- */

  const wrapperVariantStyle = useMemo<ViewStyle>(() => {
    // ✅ 지금은 default만 존재
    if (variant === 'default') {
      return {
        borderRadius: 4,
        backgroundColor: theme.colors.gray5,
        paddingHorizontal: 12,
        height: 40,
        justifyContent: 'center',
      };
    }

    // ✅ 타입상 여기로는 못 오지만, 나중 확장 대비
    return {};
  }, [variant]);

  const inputBaseStyle = useMemo<TextStyle>(() => {
    return {
      flex: 1,
      fontSize: 14,
      color: theme.colors.text,
    };
  }, [theme.colors.text]);

  return (
    <View style={[styles.wrapper, wrapperVariantStyle, containerStyle]}>
      <TextInput
        style={[styles.input, inputBaseStyle, inputStyle]}
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

export default ERInput;

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  input: {
    width: '100%',
  },
});
