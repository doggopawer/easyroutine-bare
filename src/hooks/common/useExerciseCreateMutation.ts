import { ExerciseCreateReq, ExerciseCreateRes } from '@/types/exercise';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Result } from './useResultQuery';
import { QK } from '@/constants/query-keys';
import { requestExerciseCreate } from '@/services/exerciseCreateService';

export const useExerciseCreateMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<Result<ExerciseCreateRes>, Error, ExerciseCreateReq>({
    mutationFn: async params => {
      const result: Result<ExerciseCreateRes> = await requestExerciseCreate(params);
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
