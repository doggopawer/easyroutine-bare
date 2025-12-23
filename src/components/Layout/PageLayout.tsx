import React, { useMemo, useState } from 'react';
import { ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styled from 'styled-components/native';
import BottomNavigation from '../composites/BottomNavigation';
import CircleButton from '@/components/CircleButton';

export type PageLayoutMode = 'tab' | 'stack' | 'auth';
export type MainTabName = 'Home' | 'History' | 'Library' | 'MyPage';

type OverlayRenderArgs = {
  scrollY: number;
};

type BaseProps = {
  children: React.ReactNode;
  overlay?: (args: OverlayRenderArgs) => React.ReactNode;
  helper?: React.ReactNode;
  showHeader?: boolean;
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

type RootProps = { $pt: number };

const Root = styled.View<RootProps>`
  flex: 1;
  padding-top: ${({ $pt }) => $pt}px;
  background-color: ${({ theme }) => theme.colors.gray7};
`;

const Header = styled.View`
  height: ${HEADER_HEIGHT}px;
  flex-direction: row;
  align-items: center;
  padding: 0px 8px;
  background-color: ${({ theme }) => theme.colors.gray7};
  z-index: 10;
`;

const HeaderSide = styled.View`
  width: 44px;
  align-items: center;
  justify-content: center;
`;

const HeaderCenter = styled.View`
  flex: 1;
  align-items: center;
`;

const HeaderTitle = styled.Text`
  font-size: 16px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`;

const LogoText = styled.Text`
  font-size: 24px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary1};
  margin-left: 8px;
`;

const Content = styled(ScrollView)`
  flex: 1;
`;

type StackHelperProps = { $pb: number };

const StackHelper = styled.View<StackHelperProps>`
  position: absolute;
  left: 0px;
  right: 0px;
  bottom: 0px;

  height: ${STACK_HELPER_HEIGHT}px;
  padding: 10px 16px 0px 16px;

  border-top-width: 0.5px;
  border-top-color: ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => theme.colors.background};

  padding-bottom: ${({ $pb }) => $pb}px;

  z-index: 20;
  elevation: 20;
`;

const TabFooter = styled.View`
  position: absolute;
  left: 0px;
  right: 0px;
  bottom: 0px;

  z-index: 30;
  elevation: 30;
`;

/**
 * ✅ 핵심: Overlay는 "항상 맨 위 레이어"
 * - JSX에서 "맨 마지막"에 렌더
 * - zIndex/elevation 최대로
 */
const Overlay = styled.View`
  position: absolute;
  left: 0px;
  right: 0px;
  top: 0px;
  bottom: 0px;

  z-index: 9999;
  elevation: 9999;
`;

type BackCircleWrapperProps = {
  $size: number;
};

const BackCircleWrapper = styled.View<BackCircleWrapperProps>`
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  align-items: center;
  justify-content: center;
`;

const PageLayout: React.FC<PageLayoutProps> = props => {
  const { children, overlay, helper, showHeader = true } = props;

  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const [scrollY, setScrollY] = useState(0);

  const isTab = props.mode === 'tab';
  const isStack = props.mode === 'stack';

  const title =
    props.mode === 'stack' ? props.title : props.mode === 'tab' ? props.title : undefined;

  const activeTab = props.mode === 'tab' ? props.activeTab : undefined;

  const paddingBottom = useMemo(() => {
    const tabPad = isTab && activeTab ? TAB_FOOTER_HEIGHT : 0;
    const helperPad = isStack && helper ? STACK_HELPER_HEIGHT : 0;
    return tabPad + helperPad + insets.bottom + 24;
  }, [activeTab, helper, insets.bottom, isStack, isTab]);

  const onBack = () => {
    if (navigation.canGoBack()) navigation.goBack();
  };

  return (
    <Root $pt={insets.top}>
      {/* ================= HEADER ================= */}
      {props.mode !== 'auth' && showHeader && (
        <Header>
          {isStack ? (
            <>
              {/* ✅ back button: CircleButton으로 감싸기 */}
              <HeaderSide>
                <BackCircleWrapper $size={36}>
                  <CircleButton width={36} height={36} onCircleButtonClick={onBack}>
                    <Ionicons name="chevron-back" size={20} color="#ffffff" />
                  </CircleButton>
                </BackCircleWrapper>
              </HeaderSide>

              <HeaderCenter>
                <HeaderTitle numberOfLines={1}>{title}</HeaderTitle>
              </HeaderCenter>

              <HeaderSide />
            </>
          ) : (
            <LogoText>EASYROUTINE</LogoText>
          )}
        </Header>
      )}

      {/* ================= CONTENT ================= */}
      <Content
        contentContainerStyle={{ padding: 16, paddingBottom }}
        onScroll={e => setScrollY(e.nativeEvent.contentOffset.y)}
        scrollEventThrottle={16}
      >
        {children}
      </Content>

      {/* ================= STACK HELPER ================= */}
      {isStack && helper ? <StackHelper $pb={insets.bottom}>{helper}</StackHelper> : null}

      {/* ================= TAB FOOTER ================= */}
      {isTab && activeTab ? (
        <TabFooter>
          <BottomNavigation activeTab={activeTab} />
        </TabFooter>
      ) : null}

      {/* ✅✅✅ ================= OVERLAY (맨 마지막!) ================= */}
      {overlay ? <Overlay pointerEvents="box-none">{overlay({ scrollY })}</Overlay> : null}
    </Root>
  );
};

export default PageLayout;
