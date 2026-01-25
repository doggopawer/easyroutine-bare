import React from 'react';
import ERConfirmModal from '@/components/ui/ERConfirmModal/ERConfirmModal';

type RoutineFinishConfirmModalProps = {
  open: boolean;
  onOpenChange: (next: boolean) => void;
  onConfirm: () => void;
  accentColor?: string;
};

const RoutineFinishConfirmModal: React.FC<RoutineFinishConfirmModalProps> = ({
  open,
  onOpenChange,
  onConfirm,
  accentColor,
}) => {
  return (
    <ERConfirmModal
      open={open}
      onOpenChange={onOpenChange}
      title="루틴 완료"
      description="모든 세트를 완료했습니다. 루틴을 저장하시겠습니까?"
      cancelText="취소"
      confirmText="저장"
      onConfirm={onConfirm}
      accentColor={accentColor}
    />
  );
};

export default RoutineFinishConfirmModal;
export type { RoutineFinishConfirmModalProps };
