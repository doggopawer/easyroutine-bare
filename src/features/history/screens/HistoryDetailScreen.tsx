import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HistoryStackParamList } from '../../../navigation/types';
import PageLayout from '@/components/Layout/PageLayout';

type Props = NativeStackScreenProps<HistoryStackParamList, 'HistoryDetail'>;

const HistoryDetailScreen: React.FC<Props> = ({ route }) => {
  const { recordId } = route.params;
  return (
    <PageLayout title="History Detail" showBack={true}>
      <View style={styles.container}>
        <Text style={styles.text}>History Detail: {recordId}</Text>
      </View>
    </PageLayout>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 20 },
});

export default HistoryDetailScreen;
