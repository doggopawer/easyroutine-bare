// 파일: shared/headless/accordion/AccordionVisible.tsx
// 목적: AccordionVisible
// - RN View 기반 래퍼

import React from 'react';
import type { ViewProps } from 'react-native';
import { View } from 'react-native';

type AccordionVisibleProps = ViewProps & {
  children: React.ReactNode;
};

const AccordionVisible: React.FC<AccordionVisibleProps> = ({ children, ...props }) => {
  return <View {...props}>{children}</View>;
};

export default AccordionVisible;
