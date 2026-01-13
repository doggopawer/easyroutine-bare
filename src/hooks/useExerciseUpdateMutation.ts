import { ExerciseUpdateReq, ExerciseUpdateRes } from '@/types/exercise';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Result } from './useResultQuery';
import { QK } from '@/constants/query-keys';
import { requestExerciseUpdate } from '@/services/exerciseUpdateService';

export const useExerciseUpdateMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<Result<ExerciseUpdateRes>, Error, ExerciseUpdateReq>({
    mutationFn: async params => {
      const result: Result<ExerciseUpdateRes> = await requestExerciseUpdate(params);
      return result;
    },

    onSuccess: data => {},
    onError: error => {},
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: [QK.EXERCISE_LIST],
      });
    },
  });
};
