import { MESSAGE } from '@/constants/messages';
import { Err, Ok, Result } from '@/hooks/common/useResultQuery';
import {
  RoutineHistoryExerciseDailySummaryListFetchItem,
  RoutineHistoryExerciseDailySummaryListFetchReq,
  RoutineHistoryExerciseDailySummaryListFetchRes,
} from '@/types/routine-history';

import axiosInstance from '@/utils/axios';
import { extractApiErrorMessage } from '@/utils/error';

export const getRoutineHistoryExerciseDailySummaryListFetch = async (
  req: RoutineHistoryExerciseDailySummaryListFetchReq
): Promise<RoutineHistoryExerciseDailySummaryListFetchRes> => {
  const config = {
    url: '/v1/routines/histories/statistics',
    method: 'GET' as const,
    params: {
      exerciseId: req.exerciseId,
      period: req.period,
      type: req.type,
    },
  };
  const res = await axiosInstance<RoutineHistoryExerciseDailySummaryListFetchRes>(config);
  return res.data;
};

export const requestRoutineHistoryExerciseDailySummaryListFetch = async (
  req: RoutineHistoryExerciseDailySummaryListFetchReq
): Promise<Result<RoutineHistoryExerciseDailySummaryListFetchRes>> => {
  try {
    const data = await getRoutineHistoryExerciseDailySummaryListFetch(req);
    return Ok(data, MESSAGE.ROUTINE.LIST.SUCCESS);
  } catch (e) {
    return Err(extractApiErrorMessage(e, MESSAGE.ROUTINE.LIST.ERROR));
  }
};

/* -------------------------------------------------------------------------- */
/*                                ✅ Sample Data                               */
/* -------------------------------------------------------------------------- */

const sampleBody: RoutineHistoryExerciseDailySummaryListFetchItem[] = [
  { date: '2025-05-01', totalWorkoutTime: 3600, totalWeightLifted: 12000, totalRepCount: 120 },
  { date: '2025-05-08', totalWorkoutTime: 4200, totalWeightLifted: 13500, totalRepCount: 130 },
  { date: '2025-05-15', totalWorkoutTime: 3000, totalWeightLifted: 11000, totalRepCount: 105 },
  { date: '2025-05-22', totalWorkoutTime: 3900, totalWeightLifted: 12800, totalRepCount: 118 },
  { date: '2025-05-29', totalWorkoutTime: 4500, totalWeightLifted: 14000, totalRepCount: 140 },
];

export const requestRoutineHistoryExerciseDailySummaryListFetchSample = (
  _req?: RoutineHistoryExerciseDailySummaryListFetchReq
): Result<RoutineHistoryExerciseDailySummaryListFetchRes> =>
  Ok(
    {
      result: {
        success: true,
        code: 'OK',
        message: '샘플 루틴 운동 기록 통계 조회 성공',
      },
      body: sampleBody,
    },
    MESSAGE.ROUTINE.LIST.SUCCESS
  );
