// 파일: shared/headful/ERTab/ERTab.tsx
// 목적: ChipTab / ColorTab / IconTab / LineTab / ImageTextTab / ImageTextArrowTab 통합 ERTab 컴포넌트
// - Select(headless) 기반
// - variant를 Context로 전달하여 Item 스타일 분기
// - controlled/uncontrolled 지원

import React, { createContext, useContext, useMemo } from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import Select from '@/headless/Select/Select';
import ERTabItem from './ERTabItem';

export type ERTabVariant = 'chip' | 'color' | 'icon' | 'line' | 'image-text' | 'image-text-arrow';

type ERTabProps = {
  variant: ERTabVariant; // ✅ 탭 스타일 타입
  defaultValue: string; // ✅ uncontrolled 초기값
  children: React.ReactNode; // ✅ TabItem들
  value?: string; // ✅ controlled value
  onChange?: (value: string) => void; // ✅ value 변경 콜백
};

type ERTabComponent = React.FC<ERTabProps> & {
  Item: typeof ERTabItem; // ✅ ERTab.Item 지원
};

type ERTabContextValue = {
  variant: ERTabVariant; // ✅ 현재 variant 공유
};

const ERTabContext = createContext<ERTabContextValue | null>(null);

export const useERTabContext = () => {
  const ctx = useContext(ERTabContext);
  if (!ctx) {
    throw new Error('[ERTab] must be used within <ERTab />');
  }
  return ctx;
};

const ERTabRoot: React.FC<ERTabProps> = ({ variant, defaultValue, value, onChange, children }) => {
  const contextValue = useMemo(() => ({ variant }), [variant]);

  return (
    <ERTabContext.Provider value={contextValue}>
      <Select defaultValue={defaultValue} value={value} onChange={onChange}>
        {/* ✅ CHIP */}
        {variant === 'chip' ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.chipScroll}
            contentContainerStyle={styles.chipScrollContent}
          >
            <View style={styles.chipRow}>{children}</View>
          </ScrollView>
        ) : (
          <View
            style={[
              styles.baseRow,
              variant === 'color'
                ? styles.colorRow
                : variant === 'line'
                ? styles.lineRow
                : variant === 'image-text' || variant === 'image-text-arrow'
                ? styles.imageTextColumn
                : styles.iconRow,
            ]}
          >
            {children}
          </View>
        )}
      </Select>
    </ERTabContext.Provider>
  );
};

const ERTab = ERTabRoot as ERTabComponent;
ERTab.Item = ERTabItem;

export default ERTab;

const styles = StyleSheet.create({
  chipScroll: {
    width: '100%',
    minHeight: 32,
  },

  chipScrollContent: {},

  chipRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  baseRow: {
    width: '100%',
  },

  colorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '50%',
  },

  iconRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 52,
    paddingVertical: 8,
  },

  lineRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  // ✅ image-text / image-text-arrow 는 리스트처럼 세로로 쌓임
  imageTextColumn: {
    flexDirection: 'column',
    width: '100%',
  },
});
