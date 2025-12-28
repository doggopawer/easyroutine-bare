// 파일: shared/headless/swipeable/SwipeableHidden.tsx
// 목적: Swipeable Hidden 영역
// - 기존 기능 그대로 유지
// - maxSwipeDistance만 store에서 구독

import React from 'react';
import type { ViewProps } from 'react-native';
import { View, StyleSheet } from 'react-native';
import { useSwipeable } from './SwipeableContext';

type SwipeableHiddenProps = ViewProps & {
  children: React.ReactNode;
};

const SwipeableHidden: React.FC<SwipeableHiddenProps> = ({ children, style, ...props }) => {
  const { maxSwipeDistance } = useSwipeable();

  return (
    <View
      style={[
        styles.container,
        {
          width: maxSwipeDistance,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
};

export default SwipeableHidden;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
