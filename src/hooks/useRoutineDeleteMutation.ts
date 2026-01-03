import { RoutineDeleteReq, RoutineDeleteRes } from '@/types/routine';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Result } from './useResultQuery';
import { QK } from '@/constants/query-keys';
import { requestRoutineDelete } from '@/services/routineDeleteService';

export const useRoutineDeleteMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<Result<RoutineDeleteRes>, Error, RoutineDeleteReq>({
    mutationFn: async params => {
      const result: Result<RoutineDeleteRes> = await requestRoutineDelete(params);
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
