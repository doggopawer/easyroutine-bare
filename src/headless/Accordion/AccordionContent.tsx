// 파일: shared/headless/accordion/AccordionContent.tsx
// 목적: AccordionContent
// - open 상태만 selector로 구독 → 리렌더 최소화
// - RN reanimated 기반 height/opacity 애니메이션
// - 측정용 hidden View로 content height 계산

import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import type { ViewProps } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useAccordionStore, useAccordionStoreContext } from './AccordionContext';

type AccordionContentProps = ViewProps & {
  children: React.ReactNode;
  duration?: number;
};

const AccordionContent: React.FC<AccordionContentProps> = ({
  children,
  duration = 250,
  style,
  ...props
}) => {
  const store = useAccordionStoreContext();
  const open = useAccordionStore(store, s => s.open);

  const [measuredHeight, setMeasuredHeight] = useState(0);

  const height = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (open) {
      height.value = withTiming(measuredHeight, { duration });
      opacity.value = withTiming(1, { duration });
    } else {
      height.value = withTiming(0, { duration });
      opacity.value = withTiming(0, { duration });
    }
  }, [open, measuredHeight, duration, height, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    height: height.value,
    opacity: opacity.value,
  }));

  return (
    <View style={styles.wrapper}>
      <View
        style={styles.hiddenMeasure}
        onLayout={e => {
          const h = e.nativeEvent.layout.height;
          if (h > 0 && measuredHeight !== h) {
            setMeasuredHeight(h);
          }
        }}
      >
        {children}
      </View>

      <Animated.View style={[styles.container, animatedStyle, style]} {...props}>
        <View style={styles.inner}>{children}</View>
      </Animated.View>
    </View>
  );
};

export default AccordionContent;

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },

  hiddenMeasure: {
    position: 'absolute',
    opacity: 0,
    zIndex: -1,
    width: '100%',
  },

  container: {
    overflow: 'hidden',
    width: '100%',
  },

  inner: {
    width: '100%',
  },
});
