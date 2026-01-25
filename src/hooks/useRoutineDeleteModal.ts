import { useCallback, useMemo, useState } from 'react';

type Params = {
  onConfirmDelete: (routineId: string) => void;
};

type RoutineDeleteModalState = {
  open: boolean;
  onOpenChange: (next: boolean) => void;
  onConfirm: () => void;
  onCancel?: () => void;
};

export const useRoutineDeleteModal = ({ onConfirmDelete }: Params) => {
  const [open, setOpen] = useState<boolean>(false);
  const [deleteTargetRoutineId, setDeleteTargetRoutineId] = useState<string | null>(null);

  const handleOpenChange = useCallback((next: boolean) => {
    setOpen(next);
    if (!next) {
      setDeleteTargetRoutineId(null);
    }
  }, []);

  const openDeleteModal = useCallback((routineId: string) => {
    setDeleteTargetRoutineId(routineId);
    setOpen(true);
  }, []);

  const handleConfirm = useCallback(() => {
    if (!deleteTargetRoutineId) {
      return;
    }
    onConfirmDelete(deleteTargetRoutineId);
  }, [deleteTargetRoutineId, onConfirmDelete]);

  const modalProps = useMemo<RoutineDeleteModalState>(
    () => ({
      open,
      onOpenChange: handleOpenChange,
      onConfirm: handleConfirm,
    }),
    [open, handleOpenChange, handleConfirm]
  );

  return {
    openDeleteModal,
    modalProps,
  };
};
