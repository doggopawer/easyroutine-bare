// ChipTab.tsx
import React from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import Select from '@/headless/Select/Select'; // ✅ SelectRoot를 import 해야 함
import ChipTabItem from './ChipTabItem';

type ChipTabProps = {
  defaultValue: string;
  children: React.ReactNode;
  value?: string;
  onChange?: (value: string) => void;
};

type ChipTabComponent = React.FC<ChipTabProps> & {
  Item: typeof ChipTabItem;
};

const ChipTabRoot: React.FC<ChipTabProps> = ({ defaultValue, value, onChange, children }) => {
  return (
    <Select defaultValue={defaultValue} value={value} onChange={onChange}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.row}>{children}</View>
      </ScrollView>
    </Select>
  );
};

const ChipTab = ChipTabRoot as ChipTabComponent;
ChipTab.Item = ChipTabItem;

export default ChipTab;

const styles = StyleSheet.create({
  scroll: {
    width: '100%',
    minHeight: 32,
  },
  scrollContent: {},
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
