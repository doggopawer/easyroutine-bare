import { MESSAGE } from '@/constants/messages';
import { Err, Ok, Result } from '@/hooks/common/useResultQuery';
import { RoutineUpdateReq, RoutineUpdateRes } from '@/types/routine';
import axiosInstance from '@/utils/axios';
import { extractApiErrorMessage } from '@/utils/error';

// 사이트별 문의 삭제
export const updateRoutine = async (req: RoutineUpdateReq): Promise<RoutineUpdateRes> => {
  const config = {
    url: `/routine`,
    method: 'PUT',
  };

  const res = await axiosInstance<RoutineUpdateRes>(config);
  return res.data;
};

export const requestRoutineUpdate = async (
  req: RoutineUpdateReq
): Promise<Result<RoutineUpdateRes>> => {
  try {
    const data = await updateRoutine(req);
    return Ok(data, MESSAGE.ROUTINE.DELETE.SUCCESS);
  } catch (e) {
    return Err(extractApiErrorMessage(e, MESSAGE.ROUTINE.DELETE.ERROR));
  }
};
