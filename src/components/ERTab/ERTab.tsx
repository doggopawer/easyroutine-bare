// 파일: shared/headful/ERTab/ERTab.tsx
// 목적: ChipTab / ColorTab / IconTab 통합 ERTab 컴포넌트
// - Select(headless) 기반
// - variant를 Context로 전달하여 Item 스타일 분기
// - controlled/uncontrolled 지원

import React, { createContext, useContext, useMemo } from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import Select from '@/headless/Select/Select';
import ERTabItem from './ERTabItem';

export type ERTabVariant = 'chip' | 'color' | 'icon' | 'line';

type ERTabProps = {
  variant: ERTabVariant;
  defaultValue: string;
  children: React.ReactNode;
  value?: string;
  onChange?: (value: string) => void;
};

type ERTabComponent = React.FC<ERTabProps> & {
  Item: typeof ERTabItem;
};

type ERTabContextValue = {
  variant: ERTabVariant;
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
            style={
              variant === 'color'
                ? styles.colorRow
                : variant === 'line'
                ? styles.lineRow
                : styles.iconRow
            }
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

  colorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '50%',
  },

  iconRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 52,
    paddingVertical: 8,
  },

  lineRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
