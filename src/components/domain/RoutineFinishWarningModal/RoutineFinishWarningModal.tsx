import React from 'react';
import ERConfirmModal from '@/components/ui/ERConfirmModal/ERConfirmModal';

type RoutineFinishWarningModalProps = {
  open: boolean;
  onOpenChange: (next: boolean) => void;
  onConfirm: () => void;
  accentColor?: string;
};

const RoutineFinishWarningModal: React.FC<RoutineFinishWarningModalProps> = ({
  open,
  onOpenChange,
  onConfirm,
  accentColor,
}) => {
  return (
    <ERConfirmModal
      open={open}
      onOpenChange={onOpenChange}
      title="운동 미완료"
      description="아직 완료하지 않은 세트가 있습니다. 그래도 루틴을 종료하시겠습니까?"
      cancelText="취소"
      confirmText="종료"
      onConfirm={onConfirm}
      accentColor={accentColor}
    />
  );
};

export default RoutineFinishWarningModal;
export type { RoutineFinishWarningModalProps };
