import React from 'react';
import { View } from 'react-native';

type ERTableBodyProps = {
  children: React.ReactNode;
};

const ERTableBody: React.FC<ERTableBodyProps> = ({ children }) => {
  return <View>{children}</View>;
};

export default ERTableBody;
