// 파일: shared/headless/manySelect/ManySelectContext.tsx
// 목적: ManySelect zustand store 생성 + Context Provider + selector hook 제공

import React, { createContext, useContext } from 'react';
import { createStore } from 'zustand/vanilla';
import { useStore } from 'zustand';

export type ManySelectState = {
  values: string[]; // ✅ 선택된 값 목록
};

export type ManySelectActions = {
  toggleValue: (value: string) => void;
  setValues: (values: string[]) => void;
  isSelected: (value: string) => boolean;
};

export type ManySelectStore = ManySelectState & ManySelectActions;

export const createManySelectStore = (
  initialValues: string[],
  onChange?: (values: string[]) => void
) =>
  createStore<ManySelectStore>((set, get) => ({
    values: initialValues,

    toggleValue: (v: string) => {
      const prev = get().values;
      const exists = prev.includes(v);
      const next = exists ? prev.filter(x => x !== v) : [...prev, v];

      set({ values: next });
      onChange?.(next);
    },

    setValues: (next: string[]) => {
      set({ values: next });
      onChange?.(next);
    },

    isSelected: (v: string) => get().values.includes(v),
  }));

export type ManySelectStoreApi = ReturnType<typeof createManySelectStore>;

export const useManySelectStore = <T,>(
  store: ManySelectStoreApi,
  selector: (state: ManySelectStore) => T
): T => useStore(store, selector);

const ManySelectStoreContext = createContext<ManySelectStoreApi | null>(null);

export const ManySelectStoreProvider = ManySelectStoreContext.Provider;

export const useManySelectStoreContext = (): ManySelectStoreApi => {
  const store = useContext(ManySelectStoreContext);
  if (!store) {
    throw new Error('[ManySelect] useManySelectStoreContext must be used within <ManySelect />');
  }
  return store;
};
