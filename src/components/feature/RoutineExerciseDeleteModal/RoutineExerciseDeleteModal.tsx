import React from 'react';
import ERConfirmModal from '@/components/common/ERConfirmModal/ERConfirmModal';

type RoutineExerciseDeleteModalProps = {
  open: boolean;
  onOpenChange: (next: boolean) => void;
  onConfirm: () => void;
  accentColor?: string;
};

const RoutineExerciseDeleteModal: React.FC<RoutineExerciseDeleteModalProps> = ({
  open,
  onOpenChange,
  onConfirm,
  accentColor,
}) => {
  return (
    <ERConfirmModal
      open={open}
      onOpenChange={onOpenChange}
      title="운동 삭제"
      description="운동을 삭제하시겠습니까?"
      cancelText="취소"
      confirmText="삭제"
      onConfirm={onConfirm}
      accentColor={accentColor}
    />
  );
};

export default RoutineExerciseDeleteModal;
export type { RoutineExerciseDeleteModalProps };
