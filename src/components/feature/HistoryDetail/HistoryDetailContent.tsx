import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type HistoryDetailContentProps = {
  recordId: string | undefined;
};

const HistoryDetailContent: React.FC<HistoryDetailContentProps> = ({ recordId }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>History Detail: {recordId}</Text>
    </View>
  );
};

export default HistoryDetailContent;
export type { HistoryDetailContentProps };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
  },
});
