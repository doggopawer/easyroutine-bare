// 파일: shared/headless/accordion/AccordionStore.ts
// 목적: Accordion zustand store 생성 + Context Provider + selector hook 제공

import React, { createContext, useContext } from 'react';
import { createStore } from 'zustand/vanilla';
import { useStore } from 'zustand';

export type AccordionState = {
  open: boolean;
};

export type AccordionActions = {
  toggle: () => void;
  setOpen: (next: boolean) => void;
};

export type AccordionStore = AccordionState & AccordionActions;

export const createAccordionStore = (initialOpen: boolean, onChange?: (open: boolean) => void) =>
  createStore<AccordionStore>((set, get) => ({
    open: initialOpen,

    toggle: () => {
      const next = !get().open;
      set({ open: next });
      onChange?.(next);
    },

    setOpen: (next: boolean) => {
      set({ open: next });
      onChange?.(next);
    },
  }));

export type AccordionStoreApi = ReturnType<typeof createAccordionStore>;

export const useAccordionStore = <T>(
  store: AccordionStoreApi,
  selector: (state: AccordionStore) => T
): T => useStore(store, selector);

const AccordionStoreContext = createContext<AccordionStoreApi | null>(null);

export const AccordionStoreProvider = AccordionStoreContext.Provider;

export const useAccordionStoreContext = (): AccordionStoreApi => {
  const store = useContext(AccordionStoreContext);
  if (!store) {
    throw new Error('[Accordion] useAccordionStoreContext must be used within <Accordion />');
  }
  return store;
};
