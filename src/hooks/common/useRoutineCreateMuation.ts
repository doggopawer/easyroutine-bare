import { RoutineCreateReq, RoutineCreateRes } from '@/types/routine';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Result } from './useResultQuery';
import { QK } from '@/constants/query-keys';
import { requestRoutineCreate } from '@/services/routineCreateServie';

export const useRoutineCreateMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<Result<RoutineCreateRes>, Error, RoutineCreateReq>({
    mutationFn: async params => {
      const result: Result<RoutineCreateRes> = await requestRoutineCreate(params);
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
