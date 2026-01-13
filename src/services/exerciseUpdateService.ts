import { MESSAGE } from '@/constants/messages';
import { Err, Ok, Result } from '@/hooks/useResultQuery';
import { ExerciseUpdateReq, ExerciseUpdateRes } from '@/types/exercise';
import axiosInstance from '@/utils/axios';
import { extractApiErrorMessage } from '@/utils/error';

// 사이트별 문의 삭제
export const updateExercise = async (req: ExerciseUpdateReq): Promise<ExerciseUpdateRes> => {
  const config = {
    url: `/exercise`,
    method: 'PUT',
  };

  const res = await axiosInstance<ExerciseUpdateRes>(config);
  return res.data;
};

export const requestExerciseUpdate = async (
  req: ExerciseUpdateReq
): Promise<Result<ExerciseUpdateRes>> => {
  try {
    const data = await updateExercise(req);
    return Ok(data, MESSAGE.EXERCISE.UPDATE.SUCCESS);
  } catch (e) {
    return Err(extractApiErrorMessage(e, MESSAGE.EXERCISE.UPDATE.ERROR));
  }
};
