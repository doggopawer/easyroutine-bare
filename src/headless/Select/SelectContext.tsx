// 파일: shared/headless/select/SelectContext.tsx
// 목적: Select zustand store 생성 + Context Provider + selector hook 제공

import React, { createContext, useContext } from 'react';
import { createStore } from 'zustand/vanilla';
import { useStore } from 'zustand';

export type SelectState = {
  value: string;
};

export type SelectActions = {
  setValue: (value: string) => void;
  isSelected: (value: string) => boolean;
};

export type SelectStore = SelectState & SelectActions;

export const createSelectStore = (initialValue: string, onChange?: (value: string) => void) =>
  createStore<SelectStore>((set, get) => ({
    value: initialValue,

    setValue: (next: string) => {
      set({ value: next });
      onChange?.(next);
    },

    isSelected: (v: string) => get().value === v,
  }));

export type SelectStoreApi = ReturnType<typeof createSelectStore>;

export const useSelectStore = <T,>(store: SelectStoreApi, selector: (state: SelectStore) => T): T =>
  useStore(store, selector);

const SelectStoreContext = createContext<SelectStoreApi | null>(null);

export const SelectStoreProvider = SelectStoreContext.Provider;

export const useSelectStoreContext = (): SelectStoreApi => {
  const store = useContext(SelectStoreContext);
  if (!store) {
    throw new Error('[Select] useSelectStoreContext must be used within <Select />');
  }
  return store;
};
