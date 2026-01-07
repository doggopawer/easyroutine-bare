import { MESSAGE } from '@/constants/messages';
import { Err, Ok, Result } from '@/hooks/useResultQuery';
import { RoutineHistoryCreateReq, RoutineHistoryCreateRes } from '@/types/routine-history';

import axiosInstance from '@/utils/axios';
import { extractApiErrorMessage } from '@/utils/error';

// 사이트별 문의 삭제
export const createRoutineHistory = async (
  req: RoutineHistoryCreateReq
): Promise<RoutineHistoryCreateRes> => {
  const config = {
    url: `/routine-history`,
    method: 'POST' as const,
    data: req, // ✅✅✅ body로 req 넘기기
  };

  const res = await axiosInstance<RoutineHistoryCreateRes>(config);
  return res.data;
};

export const requestRoutineHistoryCreate = async (
  req: RoutineHistoryCreateReq
): Promise<Result<RoutineHistoryCreateRes>> => {
  try {
    const data = await createRoutineHistory(req);
    return Ok(data, MESSAGE.ROUTINE.DELETE.SUCCESS);
  } catch (e) {
    return Err(extractApiErrorMessage(e, MESSAGE.ROUTINE.DELETE.ERROR));
  }
};
