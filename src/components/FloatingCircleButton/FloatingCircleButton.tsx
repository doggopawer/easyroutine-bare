import React, { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import styled from 'styled-components/native';
import CircleButton from '@/components/CircleButton';
import Ionicons from 'react-native-vector-icons/Ionicons';

type FloatingCircleButtonProps = {
  onButtonClick?: () => void;
  width?: number;
  height?: number;
  scrollY?: number;
};

const BASE_BOTTOM = 80; // 화면에서 떠있는 위치
const HIDE_DISTANCE = 160; // 아래로 얼마나 내려가서 숨길지 (80 + 여유)
const DURATION_MS = 280;
const THRESHOLD = 8; // 이 정도 이상 움직여야 방향 전환 (깜빡임 방지)

const Wrapper = styled(Animated.View)`
  position: absolute;
  left: 0;
  right: 0;
  bottom: ${BASE_BOTTOM}px;
  align-items: center;
  z-index: 20;
`;

const FloatingCircleButton: React.FC<FloatingCircleButtonProps> = ({
  onButtonClick,
  width = 56,
  height = 56,
  scrollY,
}) => {
  const translateY = useRef(new Animated.Value(0)).current; // 0: 보임, +HIDE_DISTANCE: 숨김
  const lastScrollY = useRef(0);
  const visibleRef = useRef(true);

  const animateTo = (nextVisible: boolean) => {
    if (visibleRef.current === nextVisible) return;
    visibleRef.current = nextVisible;

    Animated.timing(translateY, {
      toValue: nextVisible ? 0 : HIDE_DISTANCE,
      duration: DURATION_MS,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    if (scrollY === undefined) return;

    const diff = scrollY - lastScrollY.current;

    // 작은 흔들림은 무시
    if (Math.abs(diff) < THRESHOLD) return;

    // 내려가면 숨기고, 올라가면 보이기
    if (diff > 0) animateTo(false);
    else animateTo(true);

    lastScrollY.current = scrollY;
  }, [scrollY]);

  return (
    <Wrapper pointerEvents="box-none" style={{ transform: [{ translateY }] }}>
      <CircleButton width={width} height={height} onCircleButtonClick={onButtonClick}>
        <Ionicons name="add" size={32} color="#fff" />
      </CircleButton>
    </Wrapper>
  );
};

export default FloatingCircleButton;
