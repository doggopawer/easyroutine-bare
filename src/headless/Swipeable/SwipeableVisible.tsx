// 파일: shared/headless/swipeable/SwipeableVisible.tsx
// 목적: Swipeable Visible 영역
// - dragStartX를 저장해두고 translationX를 누적 계산하여 오른쪽 복귀도 스무스하게 처리
// - dragging 상태를 store에 기록하여 Pressable onPress 충돌 방지 가능

import React from 'react';
import type { ViewProps } from 'react-native';
import { StyleSheet } from 'react-native';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import {
  PanGestureHandler,
  type PanGestureHandlerGestureEvent,
  type PanGestureHandlerEventPayload,
  type HandlerStateChangeEvent,
  State,
} from 'react-native-gesture-handler';
import { useSwipeable } from './SwipeableContext';

type SwipeableVisibleProps = ViewProps & {
  children: React.ReactNode;
};

const SwipeableVisible: React.FC<SwipeableVisibleProps> = ({ children, style, ...props }) => {
  const { translateX, maxSwipeDistance, openSwipe, closeSwipe, setDragging } = useSwipeable();

  // ✅ 드래그 시작 시점의 translateX 값 저장
  const dragStartX = useSharedValue(0);

  const onGestureEvent = (event: PanGestureHandlerGestureEvent) => {
    const x = event.nativeEvent.translationX;

    // ✅ 시작 기준점 + 현재 이동량
    const nextX = dragStartX.value + x;

    // ✅ 왼쪽으로만 이동 가능 (0 ~ -maxSwipeDistance)
    translateX.value = Math.max(-maxSwipeDistance, Math.min(0, nextX));
  };

  const onHandlerStateChange = (event: HandlerStateChangeEvent<PanGestureHandlerEventPayload>) => {
    const { state, translationX } = event.nativeEvent;

    if (state === State.BEGAN) {
      dragStartX.value = translateX.value; // ✅ 시작 기준점 저장
      runOnJS(setDragging)(true);
      return;
    }

    if (state === State.CANCELLED || state === State.FAILED) {
      runOnJS(setDragging)(false);
      return;
    }

    if (state !== State.END) return;

    runOnJS(setDragging)(false);

    // ✅ 최종 위치 판단 (기준점 + 이동량)
    const finalX = dragStartX.value + translationX;

    if (finalX < -maxSwipeDistance / 2) {
      runOnJS(openSwipe)();
    } else {
      runOnJS(closeSwipe)();
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <PanGestureHandler
      onGestureEvent={onGestureEvent}
      onHandlerStateChange={onHandlerStateChange}
      activeOffsetX={[-10, 10]}
      failOffsetY={[-10, 10]}
    >
      <Animated.View style={[styles.container, animatedStyle, style]} {...props}>
        {children}
      </Animated.View>
    </PanGestureHandler>
  );
};

export default SwipeableVisible;

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
});
