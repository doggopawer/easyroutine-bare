import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PageLayout from '@/components/ui/PageLayout/PageLayout';
import { useHistoryDetailScreen } from '@/hooks/useHistoryDetailScreen';

const HistoryDetailScreen: React.FC = () => {
  const { recordId } = useHistoryDetailScreen();

  return (
    <PageLayout
      mode="stack"
      title="기록 상세"
      main={
        <View style={styles.container}>
          <Text style={styles.text}>History Detail: {recordId}</Text>
        </View>
      }
    />
  );
};

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

export default HistoryDetailScreen;
