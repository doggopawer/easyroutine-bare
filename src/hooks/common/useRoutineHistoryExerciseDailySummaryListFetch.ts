// src/features/inquire/list/logic/useRoutineHistoryExerciseDailySummaryListFetch.ts
// 기능: 문의 이력 운동 통계 조회. 활성 유저는 실제 API, 비활성은 샘플.

import { useResultQuery } from '@/hooks/common/useResultQuery';

import { QK } from '@/constants/query-keys';
import { requestRoutineHistoryExerciseDailySummaryListFetchSample } from '@/services/routineHistoryExerciseDailySummaryListFetchService';
import {
  RoutineHistoryExerciseDailySummaryListFetchReq,
  RoutineHistoryExerciseDailySummaryListFetchRes,
} from '@/types/routine-history';

// params.exerciseId 가 undefined/빈값일 때 query가 불필요하게 도는 것을 방지하기 위해 enabled 추가
export const useRoutineHistoryExerciseDailySummaryListFetch = (
  params?: RoutineHistoryExerciseDailySummaryListFetchReq
) => {
  const enabled = Boolean(params?.exerciseId && params?.period && params?.type);

  const { data, isFetching, fetchStatus, ...rest } = useResultQuery<
    RoutineHistoryExerciseDailySummaryListFetchRes,
    Error,
    readonly unknown[]
  >({
    queryKey: [QK.ROUTINE_HISTORY_EXERCISE_DAILY_SUMMARY_LIST, params] as const,
    queryFn: () => requestRoutineHistoryExerciseDailySummaryListFetchSample(params),
    placeholderData: previousData => previousData,
    enabled,
  });

  return { res: data, isFetching, fetchStatus, ...rest };
};
