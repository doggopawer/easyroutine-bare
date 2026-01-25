import { MESSAGE } from '@/constants/messages';
import { Err, Ok, Result } from '@/hooks/common/useResultQuery';
import { ExerciseCreateReq, ExerciseCreateRes } from '@/types/exercise';
import axiosInstance from '@/utils/axios';
import { extractApiErrorMessage } from '@/utils/error';

// 사이트별 문의 삭제
export const createExercise = async (req: ExerciseCreateReq): Promise<ExerciseCreateRes> => {
  const config = {
    url: `/exercise`,
    method: 'POST',
  };

  const res = await axiosInstance<ExerciseCreateRes>(config);
  return res.data;
};

export const requestExerciseCreate = async (
  req: ExerciseCreateReq
): Promise<Result<ExerciseCreateRes>> => {
  try {
    const data = await createExercise(req);
    return Ok(data, MESSAGE.EXERCISE.CREATE.SUCCESS);
  } catch (e) {
    return Err(extractApiErrorMessage(e, MESSAGE.EXERCISE.CREATE.ERROR));
  }
};
