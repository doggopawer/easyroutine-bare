// src/features/inquire/list/logic/useRoutineHistoryListQuery.ts
// 기능: 문의 이력 목록 조회. 활성 유저는 실제 API, 비활성은 샘플.

import { useResultQuery } from '@/hooks/useResultQuery';
import { RoutineListReq, RoutineListRes } from '@/types/model';
import { QK } from '@/constants/query-keys';
import { requestRoutineListSample } from '@/services/routineListService';

// params.startDate 가 undefined 였다가 채워지면서 query 가 2번 조회되어서 enabled 에 추가
export const useRoutineListQuery = (params: RoutineListReq) => {
  const { data, isFetching, fetchStatus, ...rest } = useResultQuery<
    RoutineListRes,
    Error,
    readonly unknown[]
  >({
    queryKey: [QK.ROUTINE_LIST, params] as const,
    queryFn: () => requestRoutineListSample(),
    placeholderData: previousData => previousData,
  });

  return { res: data, isFetching, fetchStatus, ...rest };
};
