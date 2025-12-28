// LineTab.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import Select from '@/headless/Select/Select';
import LineTabItem from './LineTabItem';

type LineTabProps = {
  defaultValue: string;
  children: React.ReactNode;
  value?: string;
  onChange?: (value: string) => void;
};

type LineTabComponent = React.FC<LineTabProps> & {
  Item: typeof LineTabItem;
};

const LineTabRoot: React.FC<LineTabProps> = ({ defaultValue, value, onChange, children }) => {
  return (
    <Select defaultValue={defaultValue} value={value} onChange={onChange}>
      <View style={styles.wrapper}>{children}</View>
    </Select>
  );
};

const LineTab = LineTabRoot as LineTabComponent;
LineTab.Item = LineTabItem;

export default LineTab;

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    width: '100%',
  },
});
