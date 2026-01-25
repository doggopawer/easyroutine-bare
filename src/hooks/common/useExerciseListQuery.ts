// src/features/inquire/list/logic/useExerciseHistoryListQuery.ts
// 기능: 문의 이력 목록 조회. 활성 유저는 실제 API, 비활성은 샘플.

import { useResultQuery } from '@/hooks/common/useResultQuery';
import { ExerciseListReq, ExerciseListRes } from '@/types/exercise';
import { QK } from '@/constants/query-keys';
import { requestExerciseListSample } from '@/services/exerciseListService';

// params.startDate 가 undefined 였다가 채워지면서 query 가 2번 조회되어서 enabled 에 추가
export const useExerciseListQuery = (params: ExerciseListReq) => {
  const { data, isFetching, fetchStatus, ...rest } = useResultQuery<
    ExerciseListRes,
    Error,
    readonly unknown[]
  >({
    queryKey: [QK.EXERCISE_LIST, params] as const,
    queryFn: () => requestExerciseListSample(),
    placeholderData: previousData => previousData,
  });

  return { res: data, isFetching, fetchStatus, ...rest };
};
