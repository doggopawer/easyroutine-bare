// 파일: shared/headless/Modal/ModalClose.tsx
// 목적: Modal Close 버튼

import React, { memo, useCallback } from 'react';
import type { PressableProps } from 'react-native';
import { Pressable } from 'react-native';
import { useModalStore, useModalStoreContext } from './ModalContext';

export type ModalCloseProps = Omit<PressableProps, 'onPress'> & {
  children?: React.ReactNode;
  onPress?: () => void;
};

const ModalCloseBase: React.FC<ModalCloseProps> = ({ children, onPress, ...props }) => {
  const store = useModalStoreContext();
  const closeModal = useModalStore(store, s => s.closeModal);

  const handlePress = useCallback(() => {
    closeModal();
    onPress?.();
  }, [closeModal, onPress]);

  return (
    <Pressable {...props} onPress={handlePress}>
      {children}
    </Pressable>
  );
};

export default memo(ModalCloseBase);
