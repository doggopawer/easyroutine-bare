import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import LineTab from '@/components/common/LineTab/LineTab';
import { historyTabRoutes } from '@/navigation/routeConfig';

const StatisticsContent: React.FC = () => {
  return (
    <>
      <LineTab routes={historyTabRoutes} activeTab="Statistics" />
      <View style={styles.container}>
        <Text style={styles.text}>Statistics Screen</Text>
      </View>
    </>
  );
};

export default StatisticsContent;

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
