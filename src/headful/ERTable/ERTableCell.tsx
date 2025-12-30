import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';

type ERTableCellProps = {
  children: React.ReactNode;
  align?: 'left' | 'center' | 'right';
  width?: number; // ✅ 특정 열만 좁히고 싶을 때
};

const ERTableCell: React.FC<ERTableCellProps> = ({ children, align = 'center', width }) => {
  const alignStyle: ViewStyle =
    align === 'left'
      ? { alignItems: 'flex-start' }
      : align === 'right'
      ? { alignItems: 'flex-end' }
      : { alignItems: 'center' };

  return <View style={[styles.cell, alignStyle, width != null && { width }]}>{children}</View>;
};

export default ERTableCell;

const styles = StyleSheet.create({
  cell: {
    flex: 1, // ✅ 기본 균등 너비
    paddingVertical: 6,
    paddingHorizontal: 6,
    justifyContent: 'center',
  },
});
