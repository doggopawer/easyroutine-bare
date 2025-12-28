// 파일: shared/headless/accordion/Accordion.tsx
// 목적: Headless Accordion Root (Provider)
// - 컨트롤드(open, onChange) / 언컨트롤드(defaultOpen) 지원
// - zustand store를 생성하고 Context로 주입
// - Object.assign 방식으로 Accordion.Visible, Accordion.Trigger, Accordion.Content 구성

import React, { useMemo, useEffect } from 'react';
import type { ReactNode } from 'react';
import AccordionVisible from './AccordionVisible';
import AccordionTrigger from './AccordionTrigger';
import AccordionContent from './AccordionContent';
import { createAccordionStore, AccordionStoreProvider } from './AccordionContext';

export type AccordionProps = {
  children: ReactNode;
  defaultOpen?: boolean;
  open?: boolean;
  onChange?: (open: boolean) => void;
};

const AccordionRoot: React.FC<AccordionProps> = ({
  children,
  defaultOpen = false,
  open,
  onChange,
}) => {
  const store = useMemo(() => createAccordionStore(defaultOpen, onChange), [defaultOpen, onChange]);

  const isControlled = open !== undefined;

  useEffect(() => {
    if (!isControlled) return;
    store.getState().setOpen(open as boolean);
  }, [isControlled, open, store]);

  return <AccordionStoreProvider value={store}>{children}</AccordionStoreProvider>;
};

export const Accordion = Object.assign(AccordionRoot, {
  Visible: AccordionVisible,
  Trigger: AccordionTrigger,
  Content: AccordionContent,
});

export default Accordion;
