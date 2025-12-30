import React from 'react';
import { View, StyleSheet } from 'react-native';

type ERTableHeaderProps = {
  children: React.ReactNode;
};

const ERTableHeader: React.FC<ERTableHeaderProps> = ({ children }) => {
  return <View style={styles.header}>{children}</View>;
};

export default ERTableHeader;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    paddingBottom: 10,
  },
});
