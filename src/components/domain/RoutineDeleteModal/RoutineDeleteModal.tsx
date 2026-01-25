import React from 'react';
import ERConfirmModal from '@/components/ui/ERConfirmModal/ERConfirmModal';

type RoutineDeleteModalProps = {
  open: boolean;
  onOpenChange: (next: boolean) => void;
  onConfirm: () => void;
  onCancel?: () => void;
  accentColor?: string;
};

const RoutineDeleteModal: React.FC<RoutineDeleteModalProps> = ({
  open,
  onOpenChange,
  onConfirm,
  onCancel,
  accentColor,
}) => {
  return (
    <ERConfirmModal
      open={open}
      onOpenChange={onOpenChange}
      title="루틴 삭제"
      description="루틴을 삭제하시겠습니까?"
      cancelText="취소"
      confirmText="루틴 삭제"
      onConfirm={onConfirm}
      onCancel={onCancel}
      accentColor={accentColor}
    />
  );
};

export default RoutineDeleteModal;
export type { RoutineDeleteModalProps };
