import React from 'react';
import { Text, StyleSheet } from 'react-native';
import PageLayout from '@/components/PageLayout/PageLayout';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RoutineStackParamList } from '@/navigation/types';

type Props = NativeStackScreenProps<RoutineStackParamList, 'RoutineCreate'>;

const RoutineCreateScreen: React.FC<Props> = ({ route }) => {
  return (
    <PageLayout
      mode="stack"
      title="루틴 생성"
      main={
        <>
          <Text style={styles.text}>Routine Create Screen</Text>
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

export default RoutineCreateScreen;
