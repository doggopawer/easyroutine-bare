import { useRoutineListQuery } from '@/hooks/common/useRoutineListQuery';

export const useRoutineListContent = () => {
  const { res } = useRoutineListQuery({});

  const routineList = res?.body ?? [];

  return {
    // State
    routineList,
  };
};
