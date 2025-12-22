import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PageLayout from '@/components/Layout/PageLayout';
import LineTab from '@/components/composites/LineTab';
import { historyTabRoutes } from '@/navigation/routeConfig';

const StatisticsScreen: React.FC = () => {
  return (
    <PageLayout mode="tab" activeTab="History">
      <LineTab routes={historyTabRoutes} activeTab="Statistics" />

      <View style={styles.container}>
        <Text style={styles.text}>Statistics Screen</Text>
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

export default StatisticsScreen;
