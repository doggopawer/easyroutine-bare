// 파일: shared/headful/ERTable/ERTableInput.tsx
// 목적: ERTable 셀에서 사용하는 "표시 전용" 입력 박스
// - TextInput이 아니라 Pressable + Text 기반
// - 누르면 BottomSheet 등 전용 입력 UI를 띄우는 용도
// - underline 색상으로 active 상태만 표현

import React, { useCallback, useMemo } from 'react';
import { Pressable, StyleSheet, Text, View, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider/ThemeProvider';

type ERTableInputProps = {
  value: string | number;
  isActive?: boolean;
  onPress?: () => void;
  placeholder?: string;
};

const ERTableInput: React.FC<ERTableInputProps> = ({
  value,
  isActive,
  onPress,

  placeholder = '',
}) => {
  const { theme } = useTheme();

  const handlePress = useCallback(() => {
    onPress?.();
  }, [onPress]);

  const displayText = useMemo(() => {
    const v = typeof value === 'number' ? String(value) : value;
    return v.trim().length > 0 ? v : placeholder;
  }, [value, placeholder]);

  const isPlaceholder = useMemo(() => {
    const v = typeof value === 'number' ? String(value) : value;
    return v.trim().length === 0;
  }, [value]);

  return (
    <Pressable
      style={({ pressed }) => [styles.wrapper, pressed && styles.pressed]}
      onPress={handlePress}
    >
      <Text
        style={[
          styles.text,
          {
            color: isPlaceholder ? theme.colors.textMuted : theme.colors.text,
          },
        ]}
        numberOfLines={1}
      >
        {displayText}
      </Text>

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

  pressed: {
    opacity: 0.85,
  },

  text: {
    width: '100%',
    fontSize: 13,
    fontWeight: '400',
    marginBottom: 6,
    textAlign: 'center',
  },

  underline: {
    width: 40,
    height: 2,
  },
});
