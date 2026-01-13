// src/features/inquire/list/logic/service.ts

import { MESSAGE } from '@/constants/messages';
import { Err, Ok, Result } from '@/hooks/useResultQuery';
import { ExerciseListReq, ExerciseListRes } from '@/types/exercise';
import axiosInstance from '@/utils/axios';
import { extractApiErrorMessage } from '@/utils/error';

// 사이트별 문의 목록 조회
export const getExerciseList = async (req: ExerciseListReq): Promise<ExerciseListRes> => {
  const config = {
    url: `/exercise`,
    method: 'GET' as const,
    params: req,
  };
  const res = await axiosInstance<ExerciseListRes>(config);
  return res.data;
};

export const requestExerciseList = async (
  req: ExerciseListReq
): Promise<Result<ExerciseListRes>> => {
  try {
    const data = await getExerciseList(req);
    return Ok(data, MESSAGE.ROUTINE.LIST.SUCCESS);
  } catch (e) {
    return Err(extractApiErrorMessage(e, MESSAGE.ROUTINE.LIST.ERROR));
  }
};

/* -------------------------------------------------------------------------- */
/*                                ✅ Sample Data                               */
/* -------------------------------------------------------------------------- */

export const requestExerciseListSample = (): Result<ExerciseListRes> =>
  Ok(
    {
      result: {
        success: true,
        code: 'OK',
        message: '샘플 운동 목록 조회 성공',
      },

      // ✅ ExerciseListRes = Response<Exercise[]>
      body: [
        {
          id: 'exercise-1',
          name: '벤치프레스',
          image: 'https://picsum.photos/id/101/200/200',
          category: 'CHEST',
          types: ['WEIGHT', 'COUNT', 'REST'],
          isEditable: 0,
          shareLevel: 1,
        },
        {
          id: 'exercise-2',
          name: '숄더프레스',
          image: 'https://picsum.photos/id/102/200/200',
          category: 'SHOULDER',
          types: ['WEIGHT', 'COUNT', 'REST'],
          isEditable: 0,
          shareLevel: 1,
        },
        {
          id: 'exercise-3',
          name: '스쿼트',
          image: 'https://picsum.photos/id/103/200/200',
          category: 'LEG',
          types: ['WEIGHT', 'COUNT', 'REST'],
          isEditable: 0,
          shareLevel: 1,
        },
        {
          id: 'exercise-4',
          name: '데드리프트',
          image: 'https://picsum.photos/id/104/200/200',
          category: 'BACK',
          types: ['WEIGHT', 'COUNT', 'REST'],
          isEditable: 0,
          shareLevel: 1,
        },
        {
          id: 'exercise-5',
          name: '바이셉 컬',
          image: 'https://picsum.photos/id/104/200/200',
          category: 'ARM',
          types: ['WEIGHT', 'COUNT', 'REST'],
          isEditable: 0,
          shareLevel: 1,
        },
        {
          id: 'exercise-6',
          name: '바이셉 컬',
          image: 'https://picsum.photos/id/104/200/200',
          category: 'ARM',
          types: ['WEIGHT', 'COUNT', 'REST'],
          isEditable: 0,
          shareLevel: 1,
        },
        {
          id: 'exercise-7',
          name: '바이셉 컬',
          image: 'https://picsum.photos/id/104/200/200',
          category: 'ARM',
          types: ['WEIGHT', 'COUNT', 'REST'],
          isEditable: 0,
          shareLevel: 1,
        },
        {
          id: 'exercise-8',
          name: '바이셉 컬',
          image: 'https://picsum.photos/id/104/200/200',
          category: 'ARM',
          types: ['WEIGHT', 'COUNT', 'REST'],
          isEditable: 0,
          shareLevel: 1,
        },
        {
          id: 'exercise-9',
          name: '바이셉 컬',
          image: 'https://picsum.photos/id/104/200/200',
          category: 'ARM',
          types: ['WEIGHT', 'COUNT', 'REST'],
          isEditable: 0,
          shareLevel: 1,
        },
      ],
    },
    MESSAGE.EXERCISE.LIST.SUCCESS
  );
