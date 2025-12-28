// 파일: shared/headless/swipeable/SwipeableStore.tsx
// 목적: Swipeable zustand store + Context 주입 + selector hook 제공
// - 기존 SwipeableContext 기능(open/close/toggle/translateX/maxSwipeDistance) 완전 동일 유지
// - dragging 상태 추가하여 Swipe 중 Pressable onPress 차단 가능

import React, { createContext, useContext } from 'react';
import { createStore } from 'zustand/vanilla';
import { useStore } from 'zustand';
import type { SharedValue } from 'react-native-reanimated';
import { withTiming } from 'react-native-reanimated';

export type SwipeableState = {
  open: boolean;
  dragging: boolean;
  translateX: SharedValue<number>;
  maxSwipeDistance: number;
  duration: number;
};

export type SwipeableActions = {
  setDragging: (dragging: boolean) => void;
  openSwipe: () => void;
  closeSwipe: () => void;
  toggleSwipe: () => void;
};

export type SwipeableStore = SwipeableState & SwipeableActions;

export type SwipeableStoreApi = ReturnType<typeof createSwipeableStore>;

export const createSwipeableStore = (params: {
  defaultOpen: boolean;
  maxSwipeDistance: number;
  translateX: SharedValue<number>;
  duration: number;
}) =>
  createStore<SwipeableStore>((set, get) => ({
    open: params.defaultOpen,
    dragging: false,
    translateX: params.translateX,
    maxSwipeDistance: params.maxSwipeDistance,
    duration: params.duration,

    setDragging: (dragging: boolean) => {
      set({ dragging });
    },

    openSwipe: () => {
      const { maxSwipeDistance, translateX, duration } = get();
      set({ open: true });
      translateX.value = withTiming(-maxSwipeDistance, { duration });
    },

    closeSwipe: () => {
      const { translateX, duration } = get();
      set({ open: false });
      translateX.value = withTiming(0, { duration });
    },

    toggleSwipe: () => {
      const { open, openSwipe, closeSwipe } = get();
      if (open) closeSwipe();
      else openSwipe();
    },
  }));

export const useSwipeableStore = <T,>(
  store: SwipeableStoreApi,
  selector: (state: SwipeableStore) => T
): T => useStore(store, selector);

const SwipeableStoreContext = createContext<SwipeableStoreApi | null>(null);

export const SwipeableStoreProvider = SwipeableStoreContext.Provider;

export const useSwipeableStoreContext = (): SwipeableStoreApi => {
  const store = useContext(SwipeableStoreContext);
  if (!store) {
    throw new Error('[Swipeable] useSwipeableStoreContext must be used within <Swipeable />');
  }
  return store;
};

/**
 * ✅ 기존 코드 호환용 hook (기존 useSwipeable() 유지)
 */
export const useSwipeable = () => {
  const store = useSwipeableStoreContext();

  const open = useSwipeableStore(store, s => s.open);
  const dragging = useSwipeableStore(store, s => s.dragging);
  const translateX = useSwipeableStore(store, s => s.translateX);
  const maxSwipeDistance = useSwipeableStore(store, s => s.maxSwipeDistance);

  const setDragging = useSwipeableStore(store, s => s.setDragging);
  const openSwipe = useSwipeableStore(store, s => s.openSwipe);
  const closeSwipe = useSwipeableStore(store, s => s.closeSwipe);
  const toggleSwipe = useSwipeableStore(store, s => s.toggleSwipe);

  return {
    open,
    dragging,
    translateX,
    maxSwipeDistance,
    setDragging,
    openSwipe,
    closeSwipe,
    toggleSwipe,
  };
};
