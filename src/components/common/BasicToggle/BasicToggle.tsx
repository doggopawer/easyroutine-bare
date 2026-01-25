// BasicToggle.tsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing, Pressable, StyleSheet } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider/ThemeProvider';

type BasicToggleProps = {
  onToggleClick: (value: boolean) => void;
  defaultValue: boolean;
};

const TRACK_WIDTH = 40;
const TRACK_HEIGHT = 25;
const THUMB_SIZE = 15;
const THUMB_LEFT_INSET = 4;

// SCSS: left: 4px 에서 시작
// SCSS: Active일 때 transform: translate(100%, -50%)
// 여기서 100%는 "thumb의 너비만큼" 이동하는 의미라서 15px 이동으로 맞춥니다.
const ACTIVE_TRANSLATE_X = THUMB_SIZE;

const BasicToggle: React.FC<BasicToggleProps> = ({ onToggleClick, defaultValue }) => {
  const { theme } = useTheme();
  const [active, setActive] = useState<boolean>(defaultValue);

  // defaultValue가 바뀌면 외부값을 따라가도록 동기화
  useEffect(() => {
    setActive(defaultValue);
  }, [defaultValue]);

  const translateX = useRef(new Animated.Value(defaultValue ? ACTIVE_TRANSLATE_X : 0)).current;

  // active 변경 시 0.2초 애니메이션으로 이동
  useEffect(() => {
    Animated.timing(translateX, {
      toValue: active ? ACTIVE_TRANSLATE_X : 0,
      duration: 200,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [active, translateX]);

  const toggle = () => {
    // 기존 React 코드처럼 "현재 값"을 콜백으로 먼저 전달하고
    onToggleClick(active);
    // 그 다음 토글 변경
    setActive(prev => !prev);
  };

  const thumbStyle = useMemo(
    () => [
      styles.thumb,
      {
        transform: [
          { translateX },
          { translateY: -THUMB_SIZE / 2 }, // SCSS: translateY(-50%) 역할
        ],
      },
    ],
    [translateX]
  );

  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{ checked: active }}
      onPress={toggle}
      style={[
        styles.track,
        {
          backgroundColor: active ? theme?.colors?.primary ?? '#3B82F6' : '#d5d5d5',
          borderColor: '#cfcfcf',
        },
      ]}
    >
      <Animated.View style={thumbStyle} />
    </Pressable>
  );
};

export default BasicToggle;

const styles = StyleSheet.create({
  track: {
    width: TRACK_WIDTH,
    height: TRACK_HEIGHT,
    borderWidth: 1,
    borderRadius: 34,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumb: {
    position: 'absolute',
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    top: '50%',
    left: THUMB_LEFT_INSET,
    backgroundColor: '#ffffff',
    borderRadius: THUMB_SIZE / 2,
  },
});
