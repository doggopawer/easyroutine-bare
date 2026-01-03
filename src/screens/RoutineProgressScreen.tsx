import React from 'react';
import { Text, StyleSheet } from 'react-native';
import PageLayout from '@/components/PageLayout/PageLayout';

const RoutineProgressScreen: React.FC = () => {
  return (
    <PageLayout
      mode="stack"
      title="루틴 진행"
      main={
        <>
          <Text style={styles.text}>Routine Progress Screen</Text>
        </>
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

export default RoutineProgressScreen;
