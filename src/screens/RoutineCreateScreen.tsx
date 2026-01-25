import React from 'react';
import PageLayout from '@/components/common/PageLayout/PageLayout';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RoutineStackParamList } from '@/navigation/types';
import ERFloatingActionButton from '@/components/common/ERFloatingActionButton/ERFloatingActionButton';
import { useTheme } from '@/theme/ThemeProvider/ThemeProvider';
import { useRoutineCreateModal } from '@/hooks/feature/useRoutineCreateModal';
import { useRoutineExerciseDeleteModal } from '@/hooks/feature/useRoutineExerciseDeleteModal';
import RoutineExerciseDeleteModal from '@/components/feature/RoutineExerciseDeleteModal/RoutineExerciseDeleteModal';
import SetUpdateBottomSheet from '@/components/feature/SetUpdateBottomSheet/SetUpdateBottomSheet';
import { useSetUpdateBottomSheet } from '@/hooks/feature/useSetUpdateBottomSheet';
import RoutineExerciseAddBottomSheet from '@/components/feature/RoutineExerciseAddBottomSheet/RoutineExerciseAddBottomSheet';
import { useRoutineExerciseAddBottomSheet } from '@/hooks/feature/useRoutineExerciseAddBottomSheet';
import RoutineCreateModal from '@/components/feature/RoutineCreateModal/RoutineCreateModal';

type Props = NativeStackScreenProps<RoutineStackParamList, 'RoutineCreate'>;

const RoutineCreateScreen: React.FC<Props> = ({ navigation }) => {
  const { theme } = useTheme();

  const {
    // State
    exerciseList,
    routineExercises,

    // Handlers
    getCellValue,
    updateRoutineSetValue,
    deleteExercise,
    addExercisesToRoutine,
    createRoutine,
  } = useRoutineCreateModal(navigation);

  const { modalProps: exerciseDeleteModalProps, openDeleteModal } =
    useRoutineExerciseDeleteModal({
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
      title="루틴 생성"
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
        <RoutineCreateModal
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

export default RoutineCreateScreen;
