// 파일: shared/headless/swipeable/Swipeable.tsx
// 목적: Swipeable Root (Provider)
// - 기존 Context 기반 SwipeableRoot 구조 유지
// - 내부적으로 zustand store 생성 + Context 주입 방식으로 변경
// - Object.assign 방식 유지 (Swipeable.Visible / Swipeable.Hidden)
// - ✅ Hidden 영역이 Visible 뒤에서 잘려 보이도록 wrapper(overflow: hidden) 추가

import React, { useMemo } from 'react';
import type { ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';

import SwipeableHidden from './SwipeableHidden';
import SwipeableVisible from './SwipeableVisible';
import { createSwipeableStore, SwipeableStoreProvider } from './SwipeableContext';

type SwipeableProps = {
  children: ReactNode;
  defaultOpen?: boolean;
  maxSwipeDistance?: number;
  duration?: number;

  // ✅ 카드처럼 라운드 적용할 때 필요
  borderRadius?: number;
};

const SwipeableRoot: React.FC<SwipeableProps> = ({
  children,
  defaultOpen = false,
  maxSwipeDistance = 120,
  duration = 250,
  borderRadius = 12,
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

  return (
    <SwipeableStoreProvider value={store}>
      {/* ✅ 핵심: Hidden 영역이 wrapper 밖으로 못 튀어나가게 잘라준다 */}
      <View style={[styles.wrapper, { borderRadius }]}>{children}</View>
    </SwipeableStoreProvider>
  );
};

const Swipeable = Object.assign(SwipeableRoot, {
  Visible: SwipeableVisible,
  Hidden: SwipeableHidden,
});

export default Swipeable;

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    overflow: 'hidden', // ✅ 핵심
  },
});
