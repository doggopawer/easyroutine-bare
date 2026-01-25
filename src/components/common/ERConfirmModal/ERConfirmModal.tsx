// 파일: shared/headful/ERConfirmModal/ERConfirmModal.tsx
// 목적: 공통 Confirm UI 모달 (headless Modal 기반)
// - icon 커스텀 가능 (기본은 느낌표)
// - accentColor로 confirm 버튼 강조 색상 변경 가능 (삭제는 red)
// - ✅ Confirm 버튼 배경이 카드 끝까지 꽉 차도록 수정 (구조 변경 방식)

import React, { useCallback, useMemo } from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import Modal from '@/headless/Modal/Modal';
import { useTheme } from '@/theme/ThemeProvider/ThemeProvider';

type ERConfirmModalProps = {
  open: boolean;
  onOpenChange: (next: boolean) => void;

  title: string;
  description: React.ReactNode;

  confirmText?: string;
  cancelText?: string;

  onConfirm: () => void;
  onCancel?: () => void;

  icon?: React.ReactNode;
  accentColor?: string;
};

const ERConfirmModal: React.FC<ERConfirmModalProps> = ({
  open,
  onOpenChange,
  title,
  description,
  confirmText = '확인',
  cancelText = '취소',
  onConfirm,
  onCancel,
  icon,
  accentColor,
}) => {
  const { theme } = useTheme();

  const resolvedAccentColor = useMemo(() => {
    return accentColor ?? theme.colors.primary1;
  }, [accentColor, theme.colors.primary1]);

  const close = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  const cancel = useCallback(() => {
    onCancel?.();
    close();
  }, [onCancel, close]);

  const confirm = useCallback(() => {
    onConfirm();
    close();
  }, [onConfirm, close]);

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <Modal.Content style={styles.modalContent}>
        {/* ✅ 카드 전체 wrapper */}
        <View style={[styles.card, { backgroundColor: theme.colors.white1 }]}>
          {/* ✅ 위쪽 내용 영역만 padding 적용 */}
          <View style={styles.contentArea}>
            {/* ✅ Icon */}
            <View style={[styles.iconCircle, { backgroundColor: resolvedAccentColor }]}>
              {icon ?? <Text style={[styles.iconText, { color: theme.colors.white1 }]}>!</Text>}
            </View>

            {/* ✅ Title */}
            <Text style={[styles.title, { color: theme.colors.text }]}>{title}</Text>

            {/* ✅ Description */}
            <Text style={[styles.description, { color: theme.colors.textMuted }]}>
              {description}
            </Text>
          </View>

          {/* ✅ Divider */}
          <View style={[styles.divider, { backgroundColor: theme.colors.gray5 }]} />

          {/* ✅ 버튼 영역은 padding 없이 카드 끝까지 */}
          <View style={styles.buttonRow}>
            {/* Cancel */}
            <Pressable style={styles.button} onPress={cancel}>
              <Text style={[styles.cancelText, { color: theme.colors.textMuted }]}>
                {cancelText}
              </Text>
            </Pressable>

            {/* Divider */}
            <View style={[styles.verticalDivider, { backgroundColor: theme.colors.gray5 }]} />

            {/* Confirm */}
            <Pressable
              style={({ pressed }) => [
                styles.button,
                { backgroundColor: resolvedAccentColor },
                pressed && styles.confirmPressed,
              ]}
              onPress={confirm}
            >
              <Text style={[styles.confirmText, { color: theme.colors.white1 }]}>
                {confirmText}
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal.Content>
    </Modal>
  );
};

export default ERConfirmModal;

const RADIUS = 18;

const styles = StyleSheet.create({
  modalContent: {
    width: 320,
  },

  card: {
    width: '100%',
    borderRadius: RADIUS,
    overflow: 'hidden',

    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 12,
  },

  /* ✅ 위쪽 컨텐츠에만 padding 적용 */
  contentArea: {
    paddingTop: 26,
    paddingHorizontal: 20,
    paddingBottom: 20,
    alignItems: 'center',
  },

  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },

  iconText: {
    fontSize: 28,
    fontWeight: '800',
  },

  title: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 12,
  },

  description: {
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 18,
  },

  divider: {
    width: '100%',
    height: 1,
  },

  /* ✅ 버튼 영역은 카드 끝까지 꽉 차게 */
  buttonRow: {
    flexDirection: 'row',
    width: '100%',
    height: 54,
  },

  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  verticalDivider: {
    width: 1,
    height: '100%',
  },

  confirmPressed: {
    opacity: 0.9,
  },

  cancelText: {
    fontSize: 15,
    fontWeight: '700',
  },

  confirmText: {
    fontSize: 15,
    fontWeight: '800',
  },
});
