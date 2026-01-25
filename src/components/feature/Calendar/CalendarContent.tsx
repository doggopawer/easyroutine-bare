import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import LineTab from '@/components/common/LineTab/LineTab';
import { historyTabRoutes } from '@/navigation/routeConfig';
import ERGraph from '@/components/common/ERGraph/ERGraph';

type CalendarContentProps = {
  highlightIndex: number;
  onHighlightChange: (index: number) => void;
  onNavigateToDetail: () => void;
};

const CalendarContent: React.FC<CalendarContentProps> = ({
  highlightIndex,
  onHighlightChange,
  onNavigateToDetail,
}) => {
  return (
    <>
      <LineTab routes={historyTabRoutes} activeTab="Calendar" />

      <View style={styles.container}>
        <Text style={styles.text}>Calendar Screen</Text>
        <Button title="View Record Detail" onPress={onNavigateToDetail} />
        <ERGraph
          data={[
            { xLabel: '4월 30일', value: 20 },
            { xLabel: '5월 1일', value: 60 },
            { xLabel: '5월 2일', value: 30 },
            { xLabel: '5월 3일', value: 80 },
            { xLabel: '5월 4일', value: 55 },
            { xLabel: '5월 5일', value: 95 },
          ]}
          onHighlightChange={onHighlightChange}
          highlightIndex={highlightIndex}
        />
      </View>
    </>
  );
};

export default CalendarContent;
export type { CalendarContentProps };

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
