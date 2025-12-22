import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import BottomNavigation from '../composites/BottomNavigation';

export type PageLayoutMode = 'tab' | 'stack' | 'auth';

type OverlayRenderArgs = {
  scrollY: number;
};

interface PageLayoutProps {
  children: React.ReactNode;
  mode: PageLayoutMode;

  /** stack일 때 중앙 타이틀 */
  title?: string;

  /** tab일 때 활성 탭 */
  activeTab?: string;

  /** FAB 같은 오버레이 */
  overlay?: (args: OverlayRenderArgs) => React.ReactNode;

  /** stack일 때 하단 helper box */
  helper?: React.ReactNode;

  /**
   * ✅ 헤더 숨김 옵션
   * - Calendar/Statistics 같은 “내부 탭 UI(LineTab)”를 상단에 붙일 때 사용
   * - 기본값 true
   */
  showHeader?: boolean;
}

const HEADER_HEIGHT = 56;
const TAB_FOOTER_HEIGHT = 90;
const STACK_HELPER_HEIGHT = 80;

const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  mode,
  title,
  activeTab,
  overlay,
  helper,
  showHeader = true,
}) => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [scrollY, setScrollY] = useState(0);

  const isTab = mode === 'tab';
  const isStack = mode === 'stack';

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* ================= HEADER ================= */}
      {mode !== 'auth' && showHeader && (
        <View style={styles.header}>
          {isStack ? (
            <>
              {/* back button */}
              <Pressable
                style={styles.headerSide}
                hitSlop={10}
                onPress={() => {
                  if (navigation.canGoBack()) navigation.goBack();
                }}
              >
                <Ionicons name="chevron-back" size={24} color="#161616" />
              </Pressable>

              {/* center title */}
              <View style={styles.headerCenter}>
                <Text style={styles.headerTitle} numberOfLines={1}>
                  {title}
                </Text>
              </View>

              {/* right placeholder */}
              <View style={styles.headerSide} />
            </>
          ) : (
            <>
              {/* tab logo header */}
              <Text style={styles.logoText}>EasyRoutine</Text>
            </>
          )}
        </View>
      )}

      {/* ================= CONTENT ================= */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={{
          padding: 16,
          paddingBottom:
            (isTab && activeTab ? TAB_FOOTER_HEIGHT : 0) +
            (isStack && helper ? STACK_HELPER_HEIGHT : 0) +
            insets.bottom +
            16,
        }}
        onScroll={e => setScrollY(e.nativeEvent.contentOffset.y)}
        scrollEventThrottle={16}
      >
        {children}
      </ScrollView>

      {/* ================= OVERLAY ================= */}
      {overlay ? (
        <View style={styles.overlay} pointerEvents="box-none">
          {overlay({ scrollY })}
        </View>
      ) : null}

      {/* ================= STACK HELPER ================= */}
      {isStack && helper ? (
        <View style={[styles.stackHelper, { paddingBottom: insets.bottom }]}>{helper}</View>
      ) : null}

      {/* ================= TAB FOOTER ================= */}
      {isTab && activeTab ? <BottomNavigation activeTab={activeTab} /> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  /* ---------- HEADER ---------- */
  header: {
    height: HEADER_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#eeeeee',
    backgroundColor: '#fff',
  },
  headerSide: {
    width: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#161616',
  },
  logoText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#161616',
    marginLeft: 8,
  },

  /* ---------- CONTENT ---------- */
  content: { flex: 1 },

  /* ---------- OVERLAY ---------- */
  overlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },

  /* ---------- STACK HELPER ---------- */
  stackHelper: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: STACK_HELPER_HEIGHT,
    paddingHorizontal: 16,
    paddingTop: 10,
    backgroundColor: '#ffffff',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#eeeeee',
  },
});

export default PageLayout;
