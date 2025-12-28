// ColorTab.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import ColorTabItem from './ColorTabItem';
import Select from '@/headless/Select/Select';

type ColorTabProps = {
  defaultValue: string;
  children: React.ReactNode;
  value?: string;
  onChange?: (value: string) => void;
};

type ColorTabComponent = React.FC<ColorTabProps> & {
  Item: typeof ColorTabItem;
};

const ColorTabRoot: React.FC<ColorTabProps> = ({ defaultValue, value, onChange, children }) => {
  return (
    <Select defaultValue={defaultValue} value={value} onChange={onChange}>
      <View style={styles.wrapper}>{children}</View>
    </Select>
  );
};

const ColorTab = ColorTabRoot as ColorTabComponent;
ColorTab.Item = ColorTabItem;

export default ColorTab;

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '50%',
  },
});
