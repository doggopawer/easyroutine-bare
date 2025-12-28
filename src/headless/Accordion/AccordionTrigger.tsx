// 파일: shared/headless/accordion/AccordionTrigger.tsx
// 목적: AccordionTrigger
// - toggle만 selector로 구독하여 리렌더 최소화
// - Pressable 기반, onPress 체이닝
// - React.memo 적용

import React, { memo, useCallback } from 'react';
import type { PressableProps, GestureResponderEvent } from 'react-native';
import { Pressable } from 'react-native';
import { useAccordionStore, useAccordionStoreContext } from './AccordionContext';

type AccordionTriggerProps = PressableProps & {
  children: React.ReactNode;
};

const AccordionTriggerBase: React.FC<AccordionTriggerProps> = ({ children, onPress, ...props }) => {
  const store = useAccordionStoreContext();

  const toggle = useAccordionStore(store, s => s.toggle);

  const handlePress: PressableProps['onPress'] = useCallback(
    (e: GestureResponderEvent) => {
      toggle();
      onPress?.(e);
    },
    [toggle, onPress]
  );

  return (
    <Pressable {...props} onPress={handlePress}>
      {children}
    </Pressable>
  );
};

const AccordionTrigger = memo(AccordionTriggerBase);

export default AccordionTrigger;
