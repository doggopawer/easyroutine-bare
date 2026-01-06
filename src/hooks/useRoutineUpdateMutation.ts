import { RoutineUpdateReq, RoutineUpdateRes } from '@/types/routine';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Result } from './useResultQuery';
import { QK } from '@/constants/query-keys';
import { requestRoutineUpdate } from '@/services/routineUpdateService';

export const useRoutineUpdateMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<Result<RoutineUpdateRes>, Error, RoutineUpdateReq>({
    mutationFn: async params => {
      const result: Result<RoutineUpdateRes> = await requestRoutineUpdate(params);
      return result;
    },

    onSuccess: data => {},
    onError: error => {},
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: [QK.ROUTINE_LIST],
      });
    },
  });
};
