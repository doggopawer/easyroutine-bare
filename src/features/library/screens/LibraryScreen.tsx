import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PageLayout from '@/components/Layout/PageLayout';

const LibraryScreen: React.FC = () => {
  return (
    <PageLayout mode="tab" activeTab="Library">
      <View style={styles.container}>
        <Text style={styles.text}>Library Screen</Text>
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

export default LibraryScreen;
