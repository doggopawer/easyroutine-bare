import { MESSAGE } from '@/constants/messages';
import { Err, Ok, Result } from '@/hooks/common/useResultQuery';
import { RoutineDeleteReq, RoutineDeleteRes } from '@/types/routine';
import axiosInstance from '@/utils/axios';
import { extractApiErrorMessage } from '@/utils/error';

// 사이트별 문의 삭제
export const deleteRoutine = async (req: RoutineDeleteReq): Promise<RoutineDeleteRes> => {
  const config = {
    url: `/routine/${req.routineId}`,
    method: 'DELETE',
  };

  const res = await axiosInstance<RoutineDeleteRes>(config);
  return res.data;
};

export const requestRoutineDelete = async (
  req: RoutineDeleteReq
): Promise<Result<RoutineDeleteRes>> => {
  try {
    const data = await deleteRoutine(req);
    return Ok(data, MESSAGE.ROUTINE.DELETE.SUCCESS);
  } catch (e) {
    return Err(extractApiErrorMessage(e, MESSAGE.ROUTINE.DELETE.ERROR));
  }
};
