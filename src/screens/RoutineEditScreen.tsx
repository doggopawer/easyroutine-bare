import React from 'react';
import PageLayout from '@/components/ui/PageLayout/PageLayout';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RoutineStackParamList } from '@/navigation/types';
import ERFloatingActionButton from '@/components/ui/ERFloatingActionButton/ERFloatingActionButton';
import { useTheme } from '@/theme/ThemeProvider/ThemeProvider';
import RoutineExerciseAccordionList from '@/components/domain/RoutineExerciseAccordionList/RoutineExerciseAccordionList';
import ERButton from '@/components/ui/ERButton/ERButton';
import { useRoutineEditScreen } from '@/hooks/useRoutineEditScreen';
import { useRoutineExerciseDeleteModal } from '@/hooks/useRoutineExerciseDeleteModal';
import RoutineExerciseDeleteModal from '@/components/domain/RoutineExerciseDeleteModal/RoutineExerciseDeleteModal';
import SetUpdateBottomSheet from '@/components/domain/SetUpdateBottomSheet/SetUpdateBottomSheet';
import { useSetUpdateBottomSheet } from '@/hooks/useSetUpdateBottomSheet';
import RoutineExerciseAddBottomSheet from '@/components/domain/RoutineExerciseAddBottomSheet/RoutineExerciseAddBottomSheet';
import { useRoutineExerciseAddBottomSheet } from '@/hooks/useRoutineExerciseAddBottomSheet';

type Props = NativeStackScreenProps<RoutineStackParamList, 'RoutineEdit'>;

const RoutineEditScreen: React.FC<Props> = ({ navigation, route }) => {
  const { theme } = useTheme();
  const { routine: initialRoutine } = route.params;

  const {
    // State
    routine,
    exerciseList,
    routineExercises,

    // Handlers
    getCellValue,
    handleUpdateRoutineSetValue,
    handleExerciseDelete,
    handleAddExercisesToRoutine,
    handleCreateRoutine,
  } = useRoutineEditScreen(initialRoutine, navigation);

  const { modalProps: exerciseDeleteModalProps, openDeleteModal } = useRoutineExerciseDeleteModal({
    onConfirmDelete: handleExerciseDelete,
  });

  const { activeCell, openSetUpdateBottomSheet, bottomSheetProps: setUpdateBottomSheetProps } =
    useSetUpdateBottomSheet({
      onConfirmUpdate: handleUpdateRoutineSetValue,
    });

  const {
    openRoutineExerciseAddBottomSheet,
    bottomSheetProps: routineExerciseAddBottomSheetProps,
  } = useRoutineExerciseAddBottomSheet({
    onConfirmAdd: handleAddExercisesToRoutine,
  });

  return (
    <PageLayout
      mode="stack"
      title={routine.name}
      scrollable={false}
      overlay={({ scrollY }) => (
        <>
          <RoutineExerciseDeleteModal
            {...exerciseDeleteModalProps}
            accentColor={theme.colors.red1}
          />

          <ERFloatingActionButton
            scrollY={scrollY}
            onButtonClick={openRoutineExerciseAddBottomSheet}
          />

          <SetUpdateBottomSheet {...setUpdateBottomSheetProps} />

          <RoutineExerciseAddBottomSheet
            {...routineExerciseAddBottomSheetProps}
            exerciseList={exerciseList}
          />
        </>
      )}
      main={
        <>
          <RoutineExerciseAccordionList
            routineExercises={routineExercises}
            activeCell={activeCell}
            getCellValue={getCellValue}
            onOpenCell={openSetUpdateBottomSheet}
            onDeleteExercise={openDeleteModal}
          />
          <ERButton variant="solid" onPress={handleCreateRoutine}>
            루틴 저장
          </ERButton>
        </>
      }
    />
  );
};

export default RoutineEditScreen;
