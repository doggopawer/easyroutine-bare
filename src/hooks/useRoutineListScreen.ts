import { useCallback } from 'react';
import { useRoutineListQuery } from '@/hooks/useRoutineListQuery';
import { useRoutineDeleteMutation } from '@/hooks/useRoutineDeleteMutation';

export const useRoutineListScreen = () => {
  const { res } = useRoutineListQuery({});
  const { mutateAsync: deleteRoutineMutate } = useRoutineDeleteMutation();

  const routineList = res?.body ?? [];

  const handleDeleteRoutine = useCallback(
    async (routineId: string) => {
      await deleteRoutineMutate({ routineId });
    },
    [deleteRoutineMutate]
  );

  return {
    // State
    routineList,

    // Handlers
    handleDeleteRoutine,
  };
};
