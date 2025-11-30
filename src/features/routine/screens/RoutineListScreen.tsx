import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RoutineStackParamList } from '../../../navigation/types';
import PageLayout from '@/components/Layout/PageLayout';

type Props = NativeStackScreenProps<RoutineStackParamList, 'RoutineList'>;

const RoutineListScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <PageLayout title="Routine" showBack={false} activeTab="Routine">
      <View style={styles.container}>
        <Text style={styles.text}>Routine List (Home)</Text>
        <Button title="Edit Routine" onPress={() => navigation.navigate('RoutineEdit')} />
        <Button title="Start Routine" onPress={() => navigation.navigate('RoutineProgress')} />
      </View>
    </PageLayout>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 20, marginBottom: 20 },
});

export default RoutineListScreen;
