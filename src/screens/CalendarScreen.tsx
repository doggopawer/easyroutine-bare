import React from 'react';
import PageLayout from '@/components/common/PageLayout/PageLayout';
import { useRoutineHistoryGraph } from '@/hooks/feature/useRoutineHistoryGraph';
import RoutineHistoryGraph from '@/components/feature/RoutineHistoryGraph/RoutineHistoryGraph';
import ERButton from '@/components/common/ERButton/ERButton';
import { useRoutineExerciseSelectBottomSheet } from '@/hooks/feature/useRoutineExerciseSelectBottomSheet';
import RoutineExerciseSelectBottomSheet from '@/components/feature/RoutineExerciseSelectBottomSheet/RoutineExerciseSelectBottomSheet';

const CalendarScreen: React.FC = () => {
  const {
    selectedExerciseId,
    openRoutineExerciseSelectBottomSheet,
    bottomSheetProps,
  } = useRoutineExerciseSelectBottomSheet();

  const {
    highlightIndex,
    setHighlightIndex,
    routineHistoryVolumeSeries,
    navigateToDetail,
  } = useRoutineHistoryGraph(selectedExerciseId);

  return (
    <PageLayout
      mode="tab"
      activeTab="History"
      scrollable
      overlay={() => (
        <RoutineExerciseSelectBottomSheet {...bottomSheetProps} />
      )}
      main={
        <>
          <RoutineHistoryGraph
            graphData={routineHistoryVolumeSeries}
            highlightIndex={highlightIndex}
            onHighlightChange={setHighlightIndex}
            onNavigateToDetail={navigateToDetail}
          />
          <ERButton variant="solid" onPress={openRoutineExerciseSelectBottomSheet}>
            운동 종목 선택
          </ERButton>
        </>
      }
    />
  );
};

export default CalendarScreen;
