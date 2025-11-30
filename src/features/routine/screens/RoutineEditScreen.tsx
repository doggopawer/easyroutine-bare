import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PageLayout from '@/components/Layout/PageLayout';

const RoutineEditScreen: React.FC = () => {
  return (
    <PageLayout title="Edit Routine" showBack={true}>
      <View style={styles.container}>
        <Text style={styles.text}>Routine Edit Screen</Text>
      </View>
    </PageLayout>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 20 },
});

export default RoutineEditScreen;
