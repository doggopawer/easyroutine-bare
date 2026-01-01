import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HistoryStackParamList } from '../navigation/types';
import PageLayout from '@/components/Layout/PageLayout';
import LineTab from '@/components/composites/LineTab';
import { historyTabRoutes } from '@/navigation/routeConfig';

const CalendarScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<HistoryStackParamList>>();

  return (
    <PageLayout
      mode="tab"
      activeTab="History"
      main={
        <>
          <LineTab routes={historyTabRoutes} activeTab="Calendar" />

          <View style={styles.container}>
            <Text style={styles.text}>Calendar Screen</Text>
            <Button
              title="View Record Detail"
              onPress={() => navigation.navigate('HistoryDetail', { recordId: '123' })}
            />
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
    marginBottom: 20,
  },
});

export default CalendarScreen;
