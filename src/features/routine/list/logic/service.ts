// src/features/inquire/list/logic/service.ts

import { MESSAGE } from '@/constants/messages';
import { Err, Ok, Result } from '@/hooks/useResultQuery';
import { RoutineListReq, RoutineListRes } from './types';
import axiosInstance from '@/features/app/network/axios';
import { extractApiErrorMessage } from '@/features/app/error/errorHandler';

// 사이트별 문의 목록 조회
export const getRoutineList = async (req: RoutineListReq): Promise<RoutineListRes> => {
  const config = {
    url: `/routine`,
    method: 'GET' as const,
    params: req,
  };
  const res = await axiosInstance<RoutineListRes>(config);
  return res.data;
};

export const requestRoutineList = async (req: RoutineListReq): Promise<Result<RoutineListRes>> => {
  try {
    const data = await getRoutineList(req);
    return Ok(data, MESSAGE.ROUTINE.LIST.SUCCESS);
  } catch (e) {
    return Err(extractApiErrorMessage(e, MESSAGE.ROUTINE.LIST.ERROR));
  }
};

/* -------------------------------------------------------------------------- */
/*                                ✅ Sample Data                               */
/* -------------------------------------------------------------------------- */

export const requestRoutineListSample = (): Result<RoutineListRes> =>
  Ok(
    {
      result: {
        success: true,
        code: 'OK',
        message: '샘플 루틴 목록 조회 성공',
      },

      // ✅ RoutineListRes는 Response<T>라서 data가 아니라 body가 필요
      body: [
        {
          id: 'routine-1',
          order: 1,
          name: '상체 루틴',
          color: '#855CF8',
          routineExercises: [
            {
              id: 'routine-ex-1',
              order: 1,
              exercise: {
                id: 'exercise-1',
                name: '벤치프레스',
                image: 'https://picsum.photos/id/101/200/200',
                category: 'CHEST',
                types: ['WEIGHT', 'COUNT', 'REST'],
                isEditable: 0,
                shareLevel: 1,
              },
              sets: [
                { id: 'set-1', order: 1, weight: 60, rep: 10, restSec: 60, exerciseSec: 0 },
                { id: 'set-2', order: 2, weight: 60, rep: 10, restSec: 60, exerciseSec: 0 },
                { id: 'set-3', order: 3, weight: 55, rep: 12, restSec: 60, exerciseSec: 0 },
              ],
            },
            {
              id: 'routine-ex-2',
              order: 2,
              exercise: {
                id: 'exercise-2',
                name: '숄더프레스',
                image: 'https://picsum.photos/id/102/200/200',
                category: 'SHOULDER',
                types: ['WEIGHT', 'COUNT', 'REST'],
                isEditable: 0,
                shareLevel: 1,
              },
              sets: [
                { id: 'set-4', order: 1, weight: 20, rep: 12, restSec: 60, exerciseSec: 0 },
                { id: 'set-5', order: 2, weight: 20, rep: 12, restSec: 60, exerciseSec: 0 },
              ],
            },
          ],
        },
        {
          id: 'routine-2',
          order: 2,
          name: '하체 루틴',
          color: '#855CF8',
          routineExercises: [
            {
              id: 'routine-ex-3',
              order: 1,
              exercise: {
                id: 'exercise-3',
                name: '스쿼트',
                image: 'https://picsum.photos/id/103/200/200',
                category: 'LEG',
                types: ['WEIGHT', 'COUNT', 'REST'],
                isEditable: 0,
                shareLevel: 1,
              },
              sets: [
                { id: 'set-6', order: 1, weight: 80, rep: 8, restSec: 90, exerciseSec: 0 },
                { id: 'set-7', order: 2, weight: 80, rep: 8, restSec: 90, exerciseSec: 0 },
                { id: 'set-8', order: 3, weight: 70, rep: 10, restSec: 90, exerciseSec: 0 },
              ],
            },
          ],
        },
        {
          id: 'routine-3',
          order: 3,
          name: '하체 루틴',
          color: '#855CF8',
          routineExercises: [
            {
              id: 'routine-ex-3',
              order: 1,
              exercise: {
                id: 'exercise-3',
                name: '스쿼트',
                image: 'https://picsum.photos/id/103/200/200',
                category: 'LEG',
                types: ['WEIGHT', 'COUNT', 'REST'],
                isEditable: 0,
                shareLevel: 1,
              },
              sets: [
                { id: 'set-6', order: 1, weight: 80, rep: 8, restSec: 90, exerciseSec: 0 },
                { id: 'set-7', order: 2, weight: 80, rep: 8, restSec: 90, exerciseSec: 0 },
                { id: 'set-8', order: 3, weight: 70, rep: 10, restSec: 90, exerciseSec: 0 },
              ],
            },
          ],
        },
        {
          id: 'routine-4',
          order: 4,
          name: '하체 루틴',
          color: '#855CF8',
          routineExercises: [
            {
              id: 'routine-ex-3',
              order: 1,
              exercise: {
                id: 'exercise-3',
                name: '스쿼트',
                image: 'https://picsum.photos/id/103/200/200',
                category: 'LEG',
                types: ['WEIGHT', 'COUNT', 'REST'],
                isEditable: 0,
                shareLevel: 1,
              },
              sets: [
                { id: 'set-6', order: 1, weight: 80, rep: 8, restSec: 90, exerciseSec: 0 },
                { id: 'set-7', order: 2, weight: 80, rep: 8, restSec: 90, exerciseSec: 0 },
                { id: 'set-8', order: 3, weight: 70, rep: 10, restSec: 90, exerciseSec: 0 },
              ],
            },
          ],
        },
        {
          id: 'routine-5',
          order: 5,
          name: '상체 루틴',
          color: '#855CF8',
          routineExercises: [
            {
              id: 'routine-ex-1',
              order: 1,
              exercise: {
                id: 'exercise-1',
                name: '벤치프레스',
                image: 'https://picsum.photos/id/101/200/200',
                category: 'CHEST',
                types: ['WEIGHT', 'COUNT', 'REST'],
                isEditable: 0,
                shareLevel: 1,
              },
              sets: [
                { id: 'set-1', order: 1, weight: 60, rep: 10, restSec: 60, exerciseSec: 0 },
                { id: 'set-2', order: 2, weight: 60, rep: 10, restSec: 60, exerciseSec: 0 },
                { id: 'set-3', order: 3, weight: 55, rep: 12, restSec: 60, exerciseSec: 0 },
              ],
            },
            {
              id: 'routine-ex-6',
              order: 2,
              exercise: {
                id: 'exercise-2',
                name: '숄더프레스',
                image: 'https://picsum.photos/id/102/200/200',
                category: 'SHOULDER',
                types: ['WEIGHT', 'COUNT', 'REST'],
                isEditable: 0,
                shareLevel: 1,
              },
              sets: [
                { id: 'set-4', order: 1, weight: 20, rep: 12, restSec: 60, exerciseSec: 0 },
                { id: 'set-5', order: 2, weight: 20, rep: 12, restSec: 60, exerciseSec: 0 },
              ],
            },
          ],
        },
      ],
    },
    MESSAGE.ROUTINE.LIST.SUCCESS
  );
