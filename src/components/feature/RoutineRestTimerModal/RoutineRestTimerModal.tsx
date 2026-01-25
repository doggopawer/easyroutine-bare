import React from 'react';
import { Modal, View, Text, Pressable, StyleSheet } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider/ThemeProvider';

type RoutineRestTimerModalProps = {
  open: boolean;
  remain: number;
  onCloseTemp: () => void;
  onSkip: () => void;
  formatDuration: (sec?: number) => string;
};

const RoutineRestTimerModal: React.FC<RoutineRestTimerModalProps> = ({
  open,
  remain,
  onCloseTemp,
  onSkip,
  formatDuration,
}) => {
  const { theme } = useTheme();

  const timerColor = remain <= 10 ? theme.colors.red1 : theme.colors.primary1;

  return (
    <Modal visible={open} transparent animationType="fade">
      <View style={styles.modalBackdrop}>
        <View style={[styles.modalCard, { backgroundColor: theme.colors.white1 }]}>
          <Text style={[styles.modalTitle, { color: theme.colors.text }]}>휴식</Text>

          <Text style={[styles.timerText, { color: timerColor }]}>
            {formatDuration(remain)}
          </Text>

          <View style={styles.spacer16} />

          <Pressable
            onPress={onCloseTemp}
            style={({ pressed }) => [
              styles.modalButton,
              { backgroundColor: theme.colors.gray6 },
              pressed && { opacity: 0.85 },
            ]}
          >
            <Text style={[styles.modalButtonText, { color: theme.colors.text }]}>
              잠시 닫기
            </Text>
          </Pressable>

          <View style={styles.spacer10} />

          <Pressable
            onPress={onSkip}
            style={({ pressed }) => [
              styles.modalButton,
              { backgroundColor: theme.colors.primary1 },
              pressed && { opacity: 0.85 },
            ]}
          >
            <Text style={[styles.modalButtonText, { color: theme.colors.white1 }]}>
              스킵
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

export default RoutineRestTimerModal;
export type { RoutineRestTimerModalProps };

const styles = StyleSheet.create({
  spacer10: {
    height: 10,
  },
  spacer16: {
    height: 16,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalCard: {
    width: '100%',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  timerText: {
    marginTop: 16,
    fontSize: 42,
    fontWeight: '900',
  },
  modalButton: {
    width: '100%',
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: 15,
    fontWeight: '700',
  },
});
