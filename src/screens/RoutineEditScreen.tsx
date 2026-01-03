import React from 'react';
import { Text, StyleSheet } from 'react-native';
import PageLayout from '@/components/PageLayout/PageLayout';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RoutineStackParamList } from '@/navigation/types';

type Props = NativeStackScreenProps<RoutineStackParamList, 'RoutineEdit'>;

const RoutineEditScreen: React.FC<Props> = ({ route }) => {
  const { routineId } = route.params;

  return (
    <PageLayout
      mode="stack"
      title="루틴 수정"
      main={
        <>
          <Text style={styles.text}>Routine Edit Screen</Text>
          <Text style={styles.text}>routineId: {routineId}</Text>
        </>
      }
    />
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 20,
  },
});

export default RoutineEditScreen;
