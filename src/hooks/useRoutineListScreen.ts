import { useState, useCallback } from 'react';
import { useRoutineListQuery } from '@/hooks/useRoutineListQuery';
import { useRoutineDeleteMutation } from '@/hooks/useRoutineDeleteMutation';

export const useRoutineListScreen = () => {
  const [routineDeleteModalOpen, setRoutineDeleteModalOpen] = useState(false);
  const [deleteTargetRoutineId, setDeleteTargetRoutineId] = useState<string | null>(null);

  const { res } = useRoutineListQuery({});
  const { mutateAsync: deleteRoutineMutate } = useRoutineDeleteMutation();

  const routineList = res?.body ?? [];

  const handleCloseDeleteModal = useCallback(() => {
    setRoutineDeleteModalOpen(false);
    setDeleteTargetRoutineId(null);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!deleteTargetRoutineId) {
      return;
    }

    await deleteRoutineMutate({ routineId: deleteTargetRoutineId });

    // ✅ 삭제 성공 후 모달 닫고 상태 초기화
    handleCloseDeleteModal();
  }, [deleteTargetRoutineId, deleteRoutineMutate, handleCloseDeleteModal]);

  const handleDeletePress = useCallback((id: string) => {
    setDeleteTargetRoutineId(id);
    setRoutineDeleteModalOpen(true);
  }, []);

  return {
    // State
    routineDeleteModalOpen,
    setRoutineDeleteModalOpen,
    deleteTargetRoutineId,
    setDeleteTargetRoutineId,
    routineList,

    // Handlers
    handleCloseDeleteModal,
    handleConfirmDelete,
    handleDeletePress,
  };
};
