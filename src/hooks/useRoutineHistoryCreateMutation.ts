import { RoutineHistoryCreateReq, RoutineHistoryCreateRes } from '@/types/routine-history';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Result } from './useResultQuery';
import { requestRoutineHistoryCreate } from '@/services/routineHistoryCreateService';

export const useRoutineHistoryCreateMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<Result<RoutineHistoryCreateRes>, Error, RoutineHistoryCreateReq>({
    mutationFn: async params => {
      const result: Result<RoutineHistoryCreateRes> = await requestRoutineHistoryCreate(params);
      return result;
    },

    onSuccess: data => {},
    onError: error => {},
    onSettled: () => {
      queryClient.invalidateQueries({
        // queryKey: [QK.ROUTINE_LIST],
      });
    },
  });
};
