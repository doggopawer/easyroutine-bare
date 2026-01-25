import { MESSAGE } from '@/constants/messages';
import { Err, Ok, Result } from '@/hooks/common/useResultQuery';
import { RoutineCreateReq, RoutineCreateRes } from '@/types/routine';
import axiosInstance from '@/utils/axios';
import { extractApiErrorMessage } from '@/utils/error';

// 사이트별 문의 삭제
export const createRoutine = async (req: RoutineCreateReq): Promise<RoutineCreateRes> => {
  const config = {
    url: `/routine`,
    method: 'POST',
  };

  const res = await axiosInstance<RoutineCreateRes>(config);
  return res.data;
};

export const requestRoutineCreate = async (
  req: RoutineCreateReq
): Promise<Result<RoutineCreateRes>> => {
  try {
    const data = await createRoutine(req);
    return Ok(data, MESSAGE.ROUTINE.DELETE.SUCCESS);
  } catch (e) {
    return Err(extractApiErrorMessage(e, MESSAGE.ROUTINE.DELETE.ERROR));
  }
};
