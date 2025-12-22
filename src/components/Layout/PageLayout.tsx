import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CustomHeader from './CustomHeader';
import BottomNavigation from '../composites/BottomNavigation';

type OverlayRenderArgs = {
  scrollY: number;
};

interface PageLayoutProps {
  children: React.ReactNode;
  title?: string;
  showBack?: boolean;
  showHeader?: boolean;
  activeTab?: string;
  overlay?: (args: OverlayRenderArgs) => React.ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  title,
  showBack = false,
  showHeader = true,
  activeTab,
  overlay,
}) => {
  const insets = useSafeAreaInsets();
  const [scrollY, setScrollY] = useState(0);

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      {showHeader && <CustomHeader title={title} showBack={showBack} />}

      <ScrollView
        style={styles.content}
        contentContainerStyle={[
          styles.contentContainer,
          { paddingBottom: (activeTab ? 90 : 0) + insets.bottom + 16 },
        ]}
        onScroll={e => setScrollY(e.nativeEvent.contentOffset.y)}
        scrollEventThrottle={16}
      >
        {children}
      </ScrollView>

      {overlay ? (
        <View style={styles.overlay} pointerEvents="box-none">
          {overlay({ scrollY })}
        </View>
      ) : null}

      {activeTab && <BottomNavigation activeTab={activeTab} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { flex: 1 },
  contentContainer: { padding: 16 },
  overlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
});

export default PageLayout;
