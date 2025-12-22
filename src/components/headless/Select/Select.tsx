// 파일: shared/headless/select/Select.tsx
// 목적: Headless Select 컨텍스트 (React Native 버전)
// - 컨트롤드(value, onChange) / 언컨트롤드(defaultValue) 지원
// - 정적 프로퍼티(Item, Display) 부착
// - RN 전용: View/Pressable 기반 Item & Display 사용

import type { ReactNode } from 'react';
import React, { createContext, useContext, useMemo, useCallback, useState } from 'react';
import Item from './Item';
import { Display } from './Display';

type SelectContextType = {
  selectValue: string;
  changeSelectValue: (value: string) => void;
  isActive: (value: string) => boolean;
};

const SelectContext = createContext<SelectContextType>({
  selectValue: '',
  changeSelectValue: () => {},
  isActive: () => false,
});

type SelectProps = {
  children: ReactNode;
  defaultValue?: string;
  value?: string;
  onChange?: (value: string) => void;
};

type SelectComponent = React.FC<SelectProps> & { Item: typeof Item; Display: typeof Display };

const Select = (({ children, defaultValue = '', value, onChange }: SelectProps) => {
  const [internalValue, setInternalValue] = useState<string>(defaultValue);

  const isControlled = value !== undefined;
  const currentValue = (isControlled ? value : internalValue) as string;

  const changeSelectValue = useCallback(
    (next: string) => {
      if (isControlled) {
        onChange?.(next);
      } else {
        setInternalValue(next);
        onChange?.(next);
      }
    },
    [isControlled, onChange]
  );

  const isActive = useCallback((v: string) => v === currentValue, [currentValue]);

  const contextValue = useMemo(
    () => ({
      selectValue: currentValue,
      changeSelectValue,
      isActive,
    }),
    [currentValue, changeSelectValue, isActive]
  );

  return <SelectContext.Provider value={contextValue}>{children}</SelectContext.Provider>;
}) as SelectComponent;

Select.Item = Item;
Select.Display = Display;

export const useSelect = () => useContext(SelectContext);
export const useTabGroup = useSelect;

export { Select };
export default Select;
