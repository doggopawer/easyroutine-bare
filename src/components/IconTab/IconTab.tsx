// IconTab.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import Select from '@/headless/Select/Select';
import IconTabItem from './IconTabItem';

type IconTabProps = {
  defaultValue: string;
  children: React.ReactNode;
  value?: string;
  onChange?: (value: string) => void;
};

type IconTabComponent = React.FC<IconTabProps> & {
  Item: typeof IconTabItem;
};

const IconTabRoot: React.FC<IconTabProps> = ({ defaultValue, value, onChange, children }) => {
  return (
    <Select defaultValue={defaultValue} value={value} onChange={onChange}>
      <View style={styles.wrapper}>{children}</View>
    </Select>
  );
};

const IconTab = IconTabRoot as IconTabComponent;
IconTab.Item = IconTabItem;

export default IconTab;

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    /* 탭 영역이 눈에 띄도록 최소 높이/여백 */
    minHeight: 52,
    paddingVertical: 8,
  },
});
