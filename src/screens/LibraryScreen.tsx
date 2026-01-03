import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PageLayout from '@/components/PageLayout/PageLayout';

const LibraryScreen: React.FC = () => {
  return (
    <PageLayout
      mode="tab"
      activeTab="Library"
      main={
        <>
          <Text style={styles.text}>Library Screen</Text>
        </>
      }
    ></PageLayout>
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
