// LineSelect.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import Select from '@/headless/Select/SelectItem';
import LineSelectItem from './LineSelectItem';

type LineSelectProps = {
  children: React.ReactNode;
  defaultValue?: string;
  value?: string;
  onChange?: (value: string) => void;
};

type LineSelectComponent = React.FC<LineSelectProps> & {
  Item: typeof LineSelectItem;
};

const LineSelectRoot: React.FC<LineSelectProps> = ({ children, defaultValue, value, onChange }) => {
  return (
    <Select defaultValue={defaultValue} value={value} onChange={onChange}>
      <View style={styles.wrapper}>{children}</View>
    </Select>
  );
};

const LineSelect = LineSelectRoot as LineSelectComponent;
LineSelect.Item = LineSelectItem;

export default LineSelect;

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'column',
    gap: 10,
    height: '100%',
  },
});
