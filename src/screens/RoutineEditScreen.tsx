import React from 'react';
import PageLayout from '@/components/common/PageLayout/PageLayout';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RoutineStackParamList } from '@/navigation/types';
import ERFloatingActionButton from '@/components/common/ERFloatingActionButton/ERFloatingActionButton';
import { useTheme } from '@/theme/ThemeProvider/ThemeProvider';
import { useRoutineEditModal } from '@/hooks/feature/useRoutineEditModal';
import { useRoutineExerciseDeleteModal } from '@/hooks/feature/useRoutineExerciseDeleteModal';
import RoutineExerciseDeleteModal from '@/components/feature/RoutineExerciseDeleteModal/RoutineExerciseDeleteModal';
import SetUpdateBottomSheet from '@/components/feature/SetUpdateBottomSheet/SetUpdateBottomSheet';
import { useSetUpdateBottomSheet } from '@/hooks/feature/useSetUpdateBottomSheet';
import RoutineExerciseAddBottomSheet from '@/components/feature/RoutineExerciseAddBottomSheet/RoutineExerciseAddBottomSheet';
import { useRoutineExerciseAddBottomSheet } from '@/hooks/feature/useRoutineExerciseAddBottomSheet';
import RoutineEditModal from '@/components/feature/RoutineEditModal/RoutineEditModal';

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
    updateRoutineSetValue,
    deleteExercise,
    addExercisesToRoutine,
    createRoutine,
  } = useRoutineEditModal(initialRoutine, navigation);

  const { modalProps: exerciseDeleteModalProps, openDeleteModal } = useRoutineExerciseDeleteModal({
    onConfirmDelete: deleteExercise,
  });

  const { activeCell, openSetUpdateBottomSheet, bottomSheetProps: setUpdateBottomSheetProps } =
    useSetUpdateBottomSheet({
      onConfirmUpdate: updateRoutineSetValue,
    });

  const {
    openRoutineExerciseAddBottomSheet,
    bottomSheetProps: routineExerciseAddBottomSheetProps,
  } = useRoutineExerciseAddBottomSheet({
    onConfirmAdd: addExercisesToRoutine,
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
        <RoutineEditModal
          routineExercises={routineExercises}
          activeCell={activeCell}
          getCellValue={getCellValue}
          onOpenCell={openSetUpdateBottomSheet}
          onDeleteExercise={openDeleteModal}
          onSubmit={createRoutine}
        />
      }
    />
  );
};

export default RoutineEditScreen;
