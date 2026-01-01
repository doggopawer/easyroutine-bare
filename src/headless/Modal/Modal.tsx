// 파일: shared/headless/Modal/Modal.tsx
// 목적: Headless Modal Root (Provider)
// - zustand store + Context 주입
// - Controlled / Uncontrolled 지원
// - Object.assign 패턴 유지 (Modal.Trigger / Modal.Content / Modal.Close)

import type { ReactNode } from 'react';
import React, { useEffect, useMemo } from 'react';
import { createModalStore, ModalStoreProvider } from './ModalContext';
import ModalTrigger from './ModalTrigger';
import ModalContent from './ModalContent';
import ModalClose from './ModalClose';

export type ModalProps = {
  children: ReactNode;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

const ModalRoot: React.FC<ModalProps> = ({ children, defaultOpen = false, open, onOpenChange }) => {
  const store = useMemo(
    () => createModalStore(defaultOpen, onOpenChange),
    [defaultOpen, onOpenChange]
  );

  const isControlled = open !== undefined;

  useEffect(() => {
    if (!isControlled) return;
    store.getState().setOpen(open as boolean);
  }, [isControlled, open, store]);

  return <ModalStoreProvider value={store}>{children}</ModalStoreProvider>;
};

export const Modal = Object.assign(ModalRoot, {
  Trigger: ModalTrigger,
  Content: ModalContent,
  Close: ModalClose,
});

export default Modal;
