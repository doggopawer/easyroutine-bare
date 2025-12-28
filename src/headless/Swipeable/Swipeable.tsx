// 파일: shared/headless/swipeable/Swipeable.tsx
// 목적: Swipeable Root (Provider)
// - 기존 Context 기반 SwipeableRoot 구조 유지
// - 내부적으로 zustand store 생성 + Context 주입 방식으로 변경
// - Object.assign 방식 유지 (Swipeable.Visible / Swipeable.Hidden)

import React, { useMemo } from 'react';
import type { ReactNode } from 'react';
import { useSharedValue } from 'react-native-reanimated';
import SwipeableHidden from './SwipeableHidden';
import { createSwipeableStore, SwipeableStoreProvider } from './SwipeableContext';
import SwipeableVisible from './SwipeableVisible';

type SwipeableProps = {
  children: ReactNode;
  defaultOpen?: boolean;
  maxSwipeDistance?: number;
  duration?: number;
};

const SwipeableRoot: React.FC<SwipeableProps> = ({
  children,
  defaultOpen = false,
  maxSwipeDistance = 120,
  duration = 250,
}) => {
  const translateX = useSharedValue(defaultOpen ? -maxSwipeDistance : 0);

  const store = useMemo(
    () =>
      createSwipeableStore({
        defaultOpen,
        maxSwipeDistance,
        translateX,
        duration,
      }),
    [defaultOpen, maxSwipeDistance, duration]
  );

  return <SwipeableStoreProvider value={store}>{children}</SwipeableStoreProvider>;
};

const Swipeable = Object.assign(SwipeableRoot, {
  Visible: SwipeableVisible,
  Hidden: SwipeableHidden,
});

export default Swipeable;
