// 파일: shared/headless/Modal/ModalContent.tsx
// 목적: Modal Content (RN Modal 렌더 담당)
// - headless라 디자인은 배제하고, "레이아웃"만 제공
// - backdrop + center container 제공
// - closeOnBackdropPress 지원

import React, { useCallback } from 'react';
import { Modal as RNModal, Pressable, StyleSheet, View } from 'react-native';
import type { ViewProps } from 'react-native';
import { useModalStore, useModalStoreContext } from './ModalContext';

export type ModalContentProps = ViewProps & {
  children: React.ReactNode;
  closeOnBackdropPress?: boolean;
  animationType?: 'none' | 'slide' | 'fade';
};

const ModalContent: React.FC<ModalContentProps> = ({
  children,
  closeOnBackdropPress = true,
  animationType = 'fade',
  style,
  ...props
}) => {
  const store = useModalStoreContext();
  const open = useModalStore(store, s => s.open);
  const closeModal = useModalStore(store, s => s.closeModal);

  const handleRequestClose = useCallback(() => {
    closeModal();
  }, [closeModal]);

  const handleBackdropPress = useCallback(() => {
    if (!closeOnBackdropPress) return;
    closeModal();
  }, [closeOnBackdropPress, closeModal]);

  return (
    <RNModal
      transparent
      visible={open}
      animationType={animationType}
      onRequestClose={handleRequestClose}
    >
      {/* ✅ Backdrop */}
      <Pressable style={styles.backdrop} onPress={handleBackdropPress}>
        {/* ✅ Center Wrapper */}
        <View style={styles.center} pointerEvents="box-none">
          {/* ✅ Modal Content Container (사용자가 style로 디자인 주입 가능) */}
          <View style={[styles.content, style]} {...props}>
            {children}
          </View>
        </View>
      </Pressable>
    </RNModal>
  );
};

export default ModalContent;

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },

  content: {
    width: '100%',
  },
});
