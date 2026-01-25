// 파일: shared/headful/ERBottomSheet/ERBottomSheet.tsx
// 목적: gorhom bottom-sheet를 감싼 공통 BottomSheet 컴포넌트
// - forwardRef로 open/close API 제공
// - theme 기반 배경/핸들/라운드/패딩 통일
// - 페이지 상단에서 ref로 제어하는 방식
// - ✅ open() 시 처음부터 snapPoint 끝까지 확실히 열리도록 expand() + layout sync

import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { LayoutChangeEvent, StyleSheet } from 'react-native';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { useTheme } from '@/theme/ThemeProvider/ThemeProvider';

export type ERBottomSheetRef = {
  open: () => void;
  close: () => void;
};

export type ERBottomSheetProps = {
  children: React.ReactNode;

  /**
   * ✅ 기본 snapPoints
   * - ex) ['40%'] or [300]
   */
  snapPoints?: Array<string | number>;

  /**
   * ✅ 처음에 열린 상태로 시작할지
   */
  defaultOpen?: boolean;

  /**
   * ✅ backdrop(배경 어둡게) 사용 여부
   */
  backdrop?: boolean;

  /**
   * ✅ 닫힐 때 호출
   */
  onClose?: () => void;
};

const ERBottomSheet = forwardRef<ERBottomSheetRef, ERBottomSheetProps>(
  ({ children, snapPoints, defaultOpen = false, backdrop = true, onClose }, ref) => {
    const { theme } = useTheme();

    const bottomSheetRef = useRef<BottomSheet>(null);

    const computedSnapPoints = useMemo(() => snapPoints ?? ['45%'], [snapPoints]);
    const initialIndex = defaultOpen ? 0 : -1;

    // ✅ open 직후 layout 확정되면 다시 expand() 하도록 플래그
    const [needExpandSync, setNeedExpandSync] = useState(false);

    const open = useCallback(() => {
      // ✅ 1) 일단 expand
      bottomSheetRef.current?.expand();

      // ✅ 2) layout이 완전히 끝난 후 다시 expand() 해서 정확한 위치로 맞춤
      setNeedExpandSync(true);
    }, []);

    const close = useCallback(() => {
      bottomSheetRef.current?.close();
    }, []);

    useImperativeHandle(
      ref,
      () => ({
        open,
        close,
      }),
      [open, close]
    );

    const renderBackdrop = useCallback(
      (props: BottomSheetBackdropProps) => {
        if (!backdrop) return null;
        return (
          <BottomSheetBackdrop
            {...props}
            disappearsOnIndex={-1}
            appearsOnIndex={0}
            opacity={0.4}
            pressBehavior="close"
          />
        );
      },
      [backdrop]
    );

    const onContentLayout = useCallback(
      (_e: LayoutChangeEvent) => {
        if (!needExpandSync) return;

        // ✅ 레이아웃 확정 이후 expand() 다시 실행
        requestAnimationFrame(() => {
          bottomSheetRef.current?.expand();
          setNeedExpandSync(false);
        });
      },
      [needExpandSync]
    );

    return (
      <BottomSheet
        ref={bottomSheetRef}
        index={initialIndex}
        snapPoints={computedSnapPoints}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        handleStyle={[styles.handle, { backgroundColor: theme.colors.white1 }]}
        handleIndicatorStyle={[styles.handleIndicator, { backgroundColor: theme.colors.gray4 }]}
        backgroundStyle={[styles.sheetBackground, { backgroundColor: theme.colors.white1 }]}
        onClose={onClose}
      >
        <BottomSheetView style={styles.content} onLayout={onContentLayout}>
          {children}
        </BottomSheetView>
      </BottomSheet>
    );
  }
);

export default ERBottomSheet;

const styles = StyleSheet.create({
  sheetBackground: {
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
  },

  handle: {
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    paddingTop: 10,
    paddingBottom: 6,
  },

  handleIndicator: {
    width: 44,
    height: 5,
    borderRadius: 999,
  },

  content: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
});
