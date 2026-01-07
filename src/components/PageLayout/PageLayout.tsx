import React, { useMemo, useState } from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@/theme/ThemeProvider/ThemeProvider';
import Ionicons from 'react-native-vector-icons/Ionicons';
import type { ComponentType } from 'react';
import type { IconProps } from 'react-native-vector-icons/Icon';
import CircleButton from '../CircleButton/CircleButton';
import BottomNavigation from '../BottomNavigation/BottomNavigation';

const IonIcon = Ionicons as unknown as ComponentType<IconProps>;

export type PageLayoutMode = 'tab' | 'stack' | 'auth';
export type MainTabName = 'Home' | 'History' | 'Library' | 'MyPage';

type OverlayRenderArgs = {
  scrollY: number;
};

type BaseProps = {
  main: React.ReactNode;
  overlay?: (args: OverlayRenderArgs) => React.ReactNode;
  helper?: React.ReactNode;

  /**
   * ✅ 하단 고정 footer (옵셔널)
   * - 예: 타이머 + 루틴 완료 버튼
   */
  footer?: React.ReactNode;

  /**
   * ✅ footer 높이 (옵셔널)
   * - 기본값 FOOTER_HEIGHT
   */
  footerHeight?: number;

  showHeader?: boolean;

  /**
   * ✅ 기본 true
   * - FlatList/SectionList 같은 VirtualizedList 쓰는 화면에서는 false로 설정
   */
  scrollable?: boolean;
};

type TabModeProps = BaseProps & {
  mode: 'tab';
  activeTab: MainTabName;
  title?: string;
};

type StackModeProps = BaseProps & {
  mode: 'stack';
  title: string;
  activeTab?: never;
};

type AuthModeProps = BaseProps & {
  mode: 'auth';
  title?: never;
  activeTab?: never;
};

export type PageLayoutProps = TabModeProps | StackModeProps | AuthModeProps;

const HEADER_HEIGHT = 56;
const TAB_FOOTER_HEIGHT = 90;
const STACK_HELPER_HEIGHT = 80;
const FOOTER_HEIGHT = 120;

const PageLayout: React.FC<PageLayoutProps> = props => {
  const {
    main,
    overlay,
    helper,
    footer,
    footerHeight,
    showHeader = true,
    scrollable = false,
  } = props;

  const { theme } = useTheme();

  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const [scrollY, setScrollY] = useState(0);

  const isTab = props.mode === 'tab';
  const isStack = props.mode === 'stack';

  const title =
    props.mode === 'stack' ? props.title : props.mode === 'tab' ? props.title : undefined;

  const activeTab = props.mode === 'tab' ? props.activeTab : undefined;

  /**
   * ✅ paddingBottom 계산
   * - tabFooter / helper / footer까지 모두 포함해서
   * - main이 하단 고정 UI에 가리지 않게 함
   *
   * ✅✅✅ 핵심 수정:
   * - scrollable=false (FlatList 기반)에서는 footerPad를 paddingBottom에 포함하지 않는다.
   *   -> VirtualizedList는 내부에서 스크롤이 관리되므로 PageLayout padding으로 밀 필요가 없음
   */
  const paddingBottom = useMemo(() => {
    const tabPad = isTab && activeTab ? TAB_FOOTER_HEIGHT : 0;
    const helperPad = isStack && helper ? STACK_HELPER_HEIGHT : 0;
    const footerPad = footer ? footerHeight ?? FOOTER_HEIGHT : 0;

    return tabPad + helperPad + footerPad + insets.bottom - 18;
  }, [activeTab, helper, footer, footerHeight, insets.bottom, isStack, isTab]);

  const onBack = () => {
    if (navigation.canGoBack()) navigation.goBack();
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top, backgroundColor: theme.colors.gray7 }]}>
      {/* ================= HEADER ================= */}
      {props.mode !== 'auth' && showHeader && (
        <View style={[styles.header, { backgroundColor: theme.colors.gray7 }]}>
          {isStack ? (
            <>
              <View style={styles.headerSide}>
                <View style={[styles.backCircleWrapper, { width: 36, height: 36 }]}>
                  <CircleButton width={36} height={36} onCircleButtonClick={onBack}>
                    <IonIcon name="chevron-back" size={20} color="#ffffff" />
                  </CircleButton>
                </View>
              </View>

              <View style={styles.headerCenter}>
                <Text style={[styles.headerTitle, { color: theme.colors.text }]} numberOfLines={1}>
                  {title}
                </Text>
              </View>

              <View style={styles.headerSide} />
            </>
          ) : (
            <Text style={[styles.logoText, { color: theme.colors.primary1 }]}>EASYROUTINE</Text>
          )}
        </View>
      )}

      {/* ================= CONTENT ================= */}
      {scrollable ? (
        <ScrollView
          style={styles.content}
          contentContainerStyle={{ padding: 16, paddingBottom }}
          onScroll={e => setScrollY(e.nativeEvent.contentOffset.y)}
          scrollEventThrottle={16}
        >
          {main}
        </ScrollView>
      ) : (
        <View style={[styles.nonScrollContent, { padding: 16, paddingBottom }]}>{main}</View>
      )}

      {/* ================= STACK HELPER ================= */}
      {isStack && helper ? (
        <View
          style={[
            styles.stackHelper,
            {
              paddingBottom: insets.bottom,
              borderTopColor: theme.colors.border,
              backgroundColor: theme.colors.background,
            },
          ]}
        >
          {helper}
        </View>
      ) : null}

      {/* ================= FOOTER (옵셔널) ================= */}
      {footer ? (
        <View
          style={[
            styles.footer,
            {
              height: footerHeight ?? FOOTER_HEIGHT,
              paddingBottom: insets.bottom,
              borderTopColor: theme.colors.border,
              backgroundColor: theme.colors.background,
            },
          ]}
        >
          {footer}
        </View>
      ) : null}

      {/* ================= TAB FOOTER ================= */}
      {isTab && activeTab ? (
        <View style={styles.tabFooter}>
          <BottomNavigation activeTab={activeTab} />
        </View>
      ) : null}

      {/* ✅✅✅ ================= OVERLAY ================= */}
      {overlay ? (
        <View style={styles.overlay} pointerEvents="box-none">
          {overlay({ scrollY })}
        </View>
      ) : null}
    </View>
  );
};

export default PageLayout;

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },

  header: {
    height: HEADER_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    zIndex: 10,
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
  },

  logoText: {
    fontSize: 24,
    fontWeight: '700',
    marginLeft: 8,
  },

  content: {
    flex: 1,
  },

  nonScrollContent: {
    flex: 1,
  },

  stackHelper: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: STACK_HELPER_HEIGHT,
    paddingTop: 10,
    paddingHorizontal: 16,
    borderTopWidth: 0.5,
    zIndex: 20,
    elevation: 20,
  },

  /**
   * ✅ footer는 helper보다 위에 오도록 zIndex를 조금 더 크게
   * - helper랑 footer 동시에 쓰면 겹칠 수 있음 (권장 X)
   */
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingTop: 10,
    paddingHorizontal: 16,
    borderTopWidth: 0.5,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    zIndex: 25,
    elevation: 25,

    display: 'flex',
    justifyContent: 'center',
  },

  tabFooter: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 30,
    elevation: 30,
  },

  overlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: 9999,
    elevation: 9999,
  },

  backCircleWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
