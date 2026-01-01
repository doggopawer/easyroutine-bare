// 파일: shared/headless/Modal/ModalTrigger.tsx
// 목적: Modal Trigger

import React, { memo, useCallback } from 'react';
import type { PressableProps } from 'react-native';
import { Pressable } from 'react-native';
import { useModalStore, useModalStoreContext } from './ModalContext';

export type ModalTriggerProps = Omit<PressableProps, 'onPress'> & {
  children?: React.ReactNode;
  onPress?: () => void;
};

const ModalTriggerBase: React.FC<ModalTriggerProps> = ({ children, onPress, ...props }) => {
  const store = useModalStoreContext();
  const openModal = useModalStore(store, s => s.openModal);

  const handlePress = useCallback(() => {
    openModal();
    onPress?.();
  }, [openModal, onPress]);

  return (
    <Pressable {...props} onPress={handlePress}>
      {children}
    </Pressable>
  );
};

export default memo(ModalTriggerBase);
