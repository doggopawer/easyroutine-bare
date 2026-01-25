// 파일: src/headful/ERKeypad/ERKeypad.tsx
// 목적: BottomSheet에서 사용할 공통 숫자 키패드 UI
// - 0~9, backspace, confirm 버튼 제공
// - 눌린 키를 onKeyPress로 전달

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider/ThemeProvider';

export type ERKeypadKey =
  | '0'
  | '1'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9'
  | 'backspace'
  | 'confirm'
  | '.';

type ERKeypadProps = {
  onKeyPress: (key: ERKeypadKey) => void;
  allowDot?: boolean; // ✅ 소수점 허용 여부
};

const ERKeypad: React.FC<ERKeypadProps> = ({ onKeyPress, allowDot = false }) => {
  const { theme } = useTheme();

  const keys: ERKeypadKey[][] = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    [allowDot ? '.' : 'backspace', '0', 'confirm'],
  ];

  return (
    <View style={styles.wrapper}>
      {keys.map((row, rowIdx) => (
        <View key={rowIdx} style={styles.row}>
          {row.map(key => (
            <Pressable
              key={key}
              style={({ pressed }) => [
                styles.key,
                { backgroundColor: theme.colors.gray6 },
                pressed && { opacity: 0.7 },
              ]}
              onPress={() => onKeyPress(key)}
            >
              <Text style={[styles.keyText, { color: theme.colors.text }]}>
                {key === 'backspace' ? '⌫' : key === 'confirm' ? '완료' : key}
              </Text>
            </Pressable>
          ))}
        </View>
      ))}
    </View>
  );
};

export default ERKeypad;

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    gap: 10,
    marginTop: 20,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },

  key: {
    flex: 1,
    height: 54,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },

  keyText: {
    fontSize: 18,
    fontWeight: '700',
  },
});
