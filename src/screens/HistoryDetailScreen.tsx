import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HistoryStackParamList } from '../navigation/types';
import PageLayout from '@/components/Layout/PageLayout';

type Props = NativeStackScreenProps<HistoryStackParamList, 'HistoryDetail'>;

const HistoryDetailScreen: React.FC<Props> = ({ route }) => {
  const { recordId } = route.params;

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
