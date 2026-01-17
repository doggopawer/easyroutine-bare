import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import PageLayout from '@/components/PageLayout/PageLayout';
import LineTab from '@/components/LineTab/LineTab';
import { historyTabRoutes } from '@/navigation/routeConfig';
import ERGraph from '@/components/ERGraph/ERGraph';
import { useCalendarScreen } from '@/hooks/useCalendarScreen';

const CalendarScreen: React.FC = () => {
  const { highlightIndex, setHighlightIndex, handleNavigateToDetail } = useCalendarScreen();

  return (
    <PageLayout
      mode="tab"
      activeTab="History"
      scrollable
      main={
        <>
          <LineTab routes={historyTabRoutes} activeTab="Calendar" />

          <View style={styles.container}>
            <Text style={styles.text}>Calendar Screen</Text>
            <Button title="View Record Detail" onPress={handleNavigateToDetail} />
            <ERGraph
              data={[
                { xLabel: '4월 30일', value: 20 },
                { xLabel: '5월 1일', value: 60 },
                { xLabel: '5월 2일', value: 30 },
                { xLabel: '5월 3일', value: 80 },
                { xLabel: '5월 4일', value: 55 },
                { xLabel: '5월 5일', value: 95 },
              ]}
              onHighlightChange={setHighlightIndex}
              highlightIndex={highlightIndex}
            />
            {/* <ERCalendar value={date} onChange={handleChange} dotsByDate={dotsByDate} /> */}
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
