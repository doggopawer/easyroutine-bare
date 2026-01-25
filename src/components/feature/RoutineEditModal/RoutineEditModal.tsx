import React from 'react';
import ERButton from '@/components/common/ERButton/ERButton';
import RoutineExerciseAccordionList from '@/components/feature/RoutineExerciseAccordionList/RoutineExerciseAccordionList';
import type { RoutineExercise, Set } from '@/types/model';
import type { ActiveCell, MetricType } from '@/hooks/feature/useSetUpdateBottomSheet';

type RoutineEditModalProps = {
  routineExercises: RoutineExercise[];
  activeCell: ActiveCell | null;
  getCellValue: (set: Set, metric: MetricType) => string;
  onOpenCell: (cell: ActiveCell) => void;
  onDeleteExercise: (routineExerciseId: string) => void;
  onSubmit: () => void;
};

const RoutineEditModal: React.FC<RoutineEditModalProps> = ({
  routineExercises,
  activeCell,
  getCellValue,
  onOpenCell,
  onDeleteExercise,
  onSubmit,
}) => {
  return (
    <>
      <RoutineExerciseAccordionList
        routineExercises={routineExercises}
        activeCell={activeCell}
        getCellValue={getCellValue}
        onOpenCell={onOpenCell}
        onDeleteExercise={onDeleteExercise}
      />

      <ERButton variant="solid" onPress={onSubmit}>
        루틴 저장
      </ERButton>
    </>
  );
};

export default RoutineEditModal;
export type { RoutineEditModalProps };
