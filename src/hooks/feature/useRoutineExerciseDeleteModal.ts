import { useCallback, useMemo, useState } from 'react';

type Params = {
  onConfirmDelete: (exerciseId: string) => void;
};

type RoutineExerciseDeleteModalState = {
  open: boolean;
  onOpenChange: (next: boolean) => void;
  onConfirm: () => void;
};

export const useRoutineExerciseDeleteModal = ({ onConfirmDelete }: Params) => {
  const [open, setOpen] = useState<boolean>(false);
  const [deleteTargetExerciseId, setDeleteTargetExerciseId] = useState<string | null>(null);

  const changeOpen = useCallback((next: boolean) => {
    setOpen(next);
    if (!next) {
      setDeleteTargetExerciseId(null);
    }
  }, []);

  const openDeleteModal = useCallback((exerciseId: string) => {
    setDeleteTargetExerciseId(exerciseId);
    setOpen(true);
  }, []);

  const confirmDelete = useCallback(() => {
    if (!deleteTargetExerciseId) {
      return;
    }
    onConfirmDelete(deleteTargetExerciseId);
  }, [deleteTargetExerciseId, onConfirmDelete]);

  const modalProps = useMemo<RoutineExerciseDeleteModalState>(
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
