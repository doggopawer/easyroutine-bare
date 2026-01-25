import { useCallback, useMemo, useState } from 'react';
import { useRoutineDeleteMutation } from '@/hooks/common/useRoutineDeleteMutation';

type RoutineDeleteModalState = {
  open: boolean;
  onOpenChange: (next: boolean) => void;
  onConfirm: () => void;
  onCancel?: () => void;
};

type Options = {
  onDeleted?: () => void;
  onError?: () => void;
};

export const useRoutineDeleteModal = (options: Options = {}) => {
  const { onDeleted, onError } = options;
  const { mutateAsync: deleteRoutineMutate } = useRoutineDeleteMutation();
  const [open, setOpen] = useState<boolean>(false);
  const [deleteTargetRoutineId, setDeleteTargetRoutineId] = useState<string | null>(null);

  const changeOpen = useCallback((next: boolean) => {
    setOpen(next);
    if (!next) {
      setDeleteTargetRoutineId(null);
    }
  }, []);

  const openDeleteModal = useCallback((routineId: string) => {
    setDeleteTargetRoutineId(routineId);
    setOpen(true);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!deleteTargetRoutineId) {
      return;
    }
    try {
      await deleteRoutineMutate({ routineId: deleteTargetRoutineId });
      onDeleted?.();
    } catch (e) {
      onError?.();
    }
  }, [deleteTargetRoutineId, deleteRoutineMutate, onDeleted, onError]);

  const modalProps = useMemo<RoutineDeleteModalState>(
    () => ({
      open,
      onOpenChange: changeOpen,
      onConfirm: confirmDelete,
    }),
    [open, changeOpen, confirmDelete]
  );

  return {
    openDeleteModal,
    modalProps,
  };
};
