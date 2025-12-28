// 파일: shared/headless/select/Select.tsx
// 목적: Headless Select Root (Provider)

import type { ReactNode } from 'react';
import React, { useMemo, useEffect } from 'react';
import SelectItem from './SelectItem';
import SelectDisplay from './SelectDisplay';
import { createSelectStore, SelectStoreProvider } from './SelectContext';

export type SelectProps = {
  children: ReactNode;
  defaultValue?: string;
  value?: string;
  onChange?: (value: string) => void;
};

const SelectRoot: React.FC<SelectProps> = ({ children, defaultValue = '', value, onChange }) => {
  const store = useMemo(() => createSelectStore(defaultValue, onChange), [defaultValue, onChange]);
  const isControlled = value !== undefined;

  useEffect(() => {
    if (!isControlled) return;
    store.getState().setValue(value as string);
  }, [isControlled, store, value]);

  return <SelectStoreProvider value={store}>{children}</SelectStoreProvider>;
};

export const Select = Object.assign(SelectRoot, {
  Item: SelectItem,
  Display: SelectDisplay,
});

export default Select;
