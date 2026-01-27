import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import LineTab from '@/components/common/LineTab/LineTab';
import { historyTabRoutes } from '@/navigation/routeConfig';
import ERGraph, { ERGraphPoint } from '@/components/common/ERGraph/ERGraph';

type RoutineHistoryExerciseDailySummaryListFetchGraphProps = {
  graphData: ERGraphPoint[];
  highlightIndex: number;
  onHighlightChange: (index: number) => void;
  onNavigateToDetail: () => void;
};

const RoutineHistoryExerciseDailySummaryListFetchGraph: React.FC<
  RoutineHistoryExerciseDailySummaryListFetchGraphProps
> = ({
  graphData,
  highlightIndex,
  onHighlightChange,
  onNavigateToDetail,
}) => {
  return (
    <>
      <LineTab routes={historyTabRoutes} activeTab="Calendar" />

      <View style={styles.container}>
        <Text style={styles.text}>Routine History</Text>
        <Button title="View Record Detail" onPress={onNavigateToDetail} />
        <ERGraph
          data={graphData}
          onHighlightChange={onHighlightChange}
          highlightIndex={highlightIndex}
        />
      </View>
    </>
  );
};

export default RoutineHistoryExerciseDailySummaryListFetchGraph;
export type { RoutineHistoryExerciseDailySummaryListFetchGraphProps };

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
