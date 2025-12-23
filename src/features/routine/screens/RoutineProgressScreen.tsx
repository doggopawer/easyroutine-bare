import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PageLayout from '@/components/Layout/PageLayout';

const RoutineProgressScreen: React.FC = () => {
  return (
    <PageLayout mode="stack" title="루틴 진행">
      <View style={styles.container}>
        <Text style={styles.text}>Routine Progress Screen</Text>
      </View>
    </PageLayout>
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
