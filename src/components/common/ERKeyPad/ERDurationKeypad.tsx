// 파일: src/headful/ERKeypad/ERDurationKeypad.tsx
// 목적: 시간 입력용 키패드 UI (Time / Rest)
// - BottomSheet 내부에서 사용
// - 숫자 입력 시 MM:SS 자동 포맷 유지
// - 내부 상태는 digits만 저장 (ex: "123" => 01:23)
// - confirm 시 "MM:SS" 문자열 반환

import React, { useCallback, useMemo, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider/ThemeProvider';

type ERDurationKeypadProps = {
  defaultValue?: string; // ex: "05:30"
  onConfirm: (value: string) => void; // ex: "05:30"
  onCancel: () => void;
};

const normalizeDigits = (v: string): string => {
  // ✅ "05:30" 같은 값에서 숫자만 추출
  const digits = v.replace(/[^0-9]/g, '');
  return digits;
};

const formatDuration = (digits: string): string => {
  const safe = digits.slice(0, 4); // ✅ 최대 4자리: MMSS
  const padded = safe.padStart(4, '0');
  const mm = padded.slice(0, 2);
  const ss = padded.slice(2, 4);
  return `${mm}:${ss}`;
};

const ERDurationKeypad: React.FC<ERDurationKeypadProps> = ({
  defaultValue = '',
  onConfirm,
  onCancel,
}) => {
  const { theme } = useTheme();

  // ✅ digits만 저장 (최대 4자리)
  const [digits, setDigits] = useState(() => normalizeDigits(defaultValue));

  const display = useMemo(() => formatDuration(digits), [digits]);

  const pressNumber = useCallback((n: string) => {
    setDigits(prev => {
      const next = (prev + n).slice(0, 4); // ✅ 최대 4자리
      return next;
    });
  }, []);

  const backspace = useCallback(() => {
    setDigits(prev => (prev.length <= 1 ? '' : prev.slice(0, -1)));
  }, []);

  const clear = useCallback(() => {
    setDigits('');
  }, []);

  const confirm = useCallback(() => {
    onConfirm(formatDuration(digits));
  }, [digits, onConfirm]);

  const keypadNumbers = useMemo(() => ['1', '2', '3', '4', '5', '6', '7', '8', '9'], []);

  return (
    <View style={[styles.root, { backgroundColor: theme.colors.white1 }]}>
      {/* ✅ 입력값 표시 */}
      <View style={styles.display}>
        <Text style={[styles.displayText, { color: theme.colors.text }]}>{display}</Text>
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
            onPress={() => pressNumber(n)}
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
          onPress={() => pressNumber('0')}
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
          onPress={backspace}
        >
          <Text style={[styles.keyText, { color: theme.colors.textMuted }]}>⌫</Text>
        </Pressable>

        {/* ✅ Clear */}
        <Pressable
          style={({ pressed }) => [
            styles.key,
            { backgroundColor: theme.colors.gray6 },
            pressed && styles.keyPressed,
          ]}
          onPress={clear}
        >
          <Text style={[styles.keyText, { color: theme.colors.textMuted }]}>C</Text>
        </Pressable>
      </View>

      {/* ✅ 확인 버튼 */}
      <Pressable
        style={({ pressed }) => [
          styles.confirmButton,
          { backgroundColor: theme.colors.primary1 },
          pressed && styles.confirmPressed,
        ]}
        onPress={confirm}
      >
        <Text style={[styles.confirmText, { color: theme.colors.white1 }]}>확인</Text>
      </Pressable>
    </View>
  );
};

export default ERDurationKeypad;

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
