import React from 'react';
import { View, StyleSheet } from 'react-native';
import ERTableHeader from './ERTableHeader';
import ERTableBody from './ERTableBody';
import ERTableRow from './ERTableRow';
import ERTableCell from './ERTableCell';
import ERTableInput from './ERTableInput';
import ERTableText from './ERTableText';

type ERTableProps = {
  children: React.ReactNode;
};

const ERTableRoot: React.FC<ERTableProps> = ({ children }) => {
  return <View style={styles.table}>{children}</View>;
};

const ERTable = Object.assign(ERTableRoot, {
  Header: ERTableHeader,
  Body: ERTableBody,
  Row: ERTableRow,
  Cell: ERTableCell,
  Input: ERTableInput,
  Text: ERTableText,
});

export default ERTable;

const styles = StyleSheet.create({
  table: {
    width: '100%',
  },
});
