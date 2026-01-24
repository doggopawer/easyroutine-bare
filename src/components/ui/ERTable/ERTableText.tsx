import React from 'react';
import { StyleSheet, Text } from 'react-native';

type ERTableInputProps = {
  text: string;
};

const ERTableText: React.FC<ERTableInputProps> = ({ text }) => {
  return <Text style={styles.text}>{text}</Text>;
};

export default ERTableText;

const styles = StyleSheet.create({
  text: {
    fontSize: 13,
    fontWeight: '400',
  },
});
