// 파일: shared/headless/Modal/ModalContext.tsx
// 목적: Modal zustand store + Context Provider + selector hook 제공

import React, { createContext, useContext } from 'react';
import { createStore } from 'zustand/vanilla';
import { useStore } from 'zustand';

export type ModalState = {
  open: boolean;
};

export type ModalActions = {
  setOpen: (open: boolean) => void;
  openModal: () => void;
  closeModal: () => void;
  toggle: () => void;
};

export type ModalStore = ModalState & ModalActions;

export const createModalStore = (defaultOpen: boolean, onOpenChange?: (open: boolean) => void) =>
  createStore<ModalStore>((set, get) => ({
    open: defaultOpen,

    setOpen: next => {
      set({ open: next });
      onOpenChange?.(next);
    },

    openModal: () => {
      get().setOpen(true);
    },

    closeModal: () => {
      get().setOpen(false);
    },

    toggle: () => {
      get().setOpen(!get().open);
    },
  }));

export type ModalStoreApi = ReturnType<typeof createModalStore>;

export const useModalStore = <T,>(store: ModalStoreApi, selector: (state: ModalStore) => T): T =>
  useStore(store, selector);

const ModalStoreContext = createContext<ModalStoreApi | null>(null);

export const ModalStoreProvider = ModalStoreContext.Provider;

export const useModalStoreContext = (): ModalStoreApi => {
  const store = useContext(ModalStoreContext);
  if (!store) {
    throw new Error('[Modal] useModalStoreContext must be used within <Modal />');
  }
  return store;
};
