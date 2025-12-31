// 파일: src/headful/ERKeypad/ERDecimalKeypad.tsx
// 목적: 소수 입력용 키패드 UI (Weight 등)
// - BottomSheet 내부에서 사용
// - 숫자 + '.' 입력 가능 (소수점은 1개만 허용)
// - confirm/cancel 제공

import React, { useCallback, useMemo, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider/ThemeProvider';

type ERDecimalKeypadProps = {
  defaultValue?: string;
  onConfirm: (value: string) => void;
  onCancel: () => void;
};

const ERDecimalKeypad: React.FC<ERDecimalKeypadProps> = ({
  defaultValue = '',
  onConfirm,
  onCancel,
}) => {
  const { theme } = useTheme();
  const [value, setValue] = useState(defaultValue);

  const handlePressNumber = useCallback((n: string) => {
    setValue(prev => {
      // ✅ "0"만 있을 때 0 + 숫자 입력 시 바로 치환
      if (prev === '0') return n;
      return prev + n;
    });
  }, []);

  const handlePressDot = useCallback(() => {
    setValue(prev => {
      if (prev.includes('.')) return prev; // ✅ 소수점 1개만 허용
      if (prev.length === 0) return '0.'; // ✅ 처음이면 0. 으로 시작
      return prev + '.';
    });
  }, []);

  const handleBackspace = useCallback(() => {
    setValue(prev => (prev.length <= 1 ? '' : prev.slice(0, -1)));
  }, []);

  const handleConfirm = useCallback(() => {
    const safe = value.trim().length > 0 ? value : '0';
    onConfirm(safe);
  }, [onConfirm, value]);

  const keypadNumbers = useMemo(() => ['1', '2', '3', '4', '5', '6', '7', '8', '9'], []);

  return (
    <View style={[styles.root, { backgroundColor: theme.colors.white1 }]}>
      {/* ✅ 입력값 표시 */}
      <View style={styles.display}>
        <Text style={[styles.displayText, { color: theme.colors.text }]}>
          {value.length > 0 ? value : '0'}
        </Text>
      </View>

      {/* ✅ 키패드 */}
      <View style={styles.grid}>
        {keypadNumbers.map(n => (
          <Pressable
            key={n}
            style={({ pressed }) => [
              styles.key,
              { backgroundColor: theme.colors.gray7 },
              pressed && styles.keyPressed,
            ]}
            onPress={() => handlePressNumber(n)}
          >
            <Text style={[styles.keyText, { color: theme.colors.text }]}>{n}</Text>
          </Pressable>
        ))}

        {/* ✅ 취소 */}
        <Pressable
          style={({ pressed }) => [
            styles.key,
            { backgroundColor: theme.colors.gray6 },
            pressed && styles.keyPressed,
          ]}
          onPress={onCancel}
        >
          <Text style={[styles.keyText, { color: theme.colors.textMuted }]}>취소</Text>
        </Pressable>

        {/* ✅ 0 */}
        <Pressable
          style={({ pressed }) => [
            styles.key,
            { backgroundColor: theme.colors.gray7 },
            pressed && styles.keyPressed,
          ]}
          onPress={() => handlePressNumber('0')}
        >
          <Text style={[styles.keyText, { color: theme.colors.text }]}>0</Text>
        </Pressable>

        {/* ✅ 백스페이스 */}
        <Pressable
          style={({ pressed }) => [
            styles.key,
            { backgroundColor: theme.colors.gray6 },
            pressed && styles.keyPressed,
          ]}
          onPress={handleBackspace}
        >
          <Text style={[styles.keyText, { color: theme.colors.textMuted }]}>⌫</Text>
        </Pressable>

        {/* ✅ dot */}
        <Pressable
          style={({ pressed }) => [
            styles.key,
            { backgroundColor: theme.colors.gray7 },
            pressed && styles.keyPressed,
          ]}
          onPress={handlePressDot}
        >
          <Text style={[styles.keyText, { color: theme.colors.text }]}>.</Text>
        </Pressable>
      </View>

      {/* ✅ 확인 버튼 */}
      <Pressable
        style={({ pressed }) => [
          styles.confirmButton,
          { backgroundColor: theme.colors.primary1 },
          pressed && styles.confirmPressed,
        ]}
        onPress={handleConfirm}
      >
        <Text style={[styles.confirmText, { color: theme.colors.white1 }]}>확인</Text>
      </Pressable>
    </View>
  );
};

export default ERDecimalKeypad;

const styles = StyleSheet.create({
  root: {
    width: '100%',
    borderRadius: 16,
    padding: 16,
  },

  display: {
    width: '100%',
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },

  displayText: {
    fontSize: 32,
    fontWeight: '800',
  },

  grid: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },

  key: {
    width: '30%',
    height: 56,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },

  keyPressed: {
    opacity: 0.75,
  },

  keyText: {
    fontSize: 20,
    fontWeight: '700',
  },

  confirmButton: {
    width: '100%',
    height: 56,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
  },

  confirmPressed: {
    opacity: 0.85,
  },

  confirmText: {
    fontSize: 18,
    fontWeight: '800',
  },
});
