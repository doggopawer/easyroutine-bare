import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PageLayout from '@/components/PageLayout/PageLayout';
import LineTab from '@/components/LineTab/LineTab';
import { historyTabRoutes } from '@/navigation/routeConfig';
import { useStatisticsScreen } from '@/hooks/useStatisticsScreen';

const StatisticsScreen: React.FC = () => {
  useStatisticsScreen();

  return (
    <PageLayout
      mode="tab"
      activeTab="History"
      main={
        <>
          <LineTab routes={historyTabRoutes} activeTab="Statistics" />
          <View style={styles.container}>
            <Text style={styles.text}>Statistics Screen</Text>
          </View>
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

export default StatisticsScreen;
