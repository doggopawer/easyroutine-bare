import { Period, Response, Type } from './common';
import { RoutineHistory } from './model';

export type RoutineHistoryCreateReq = RoutineHistory;

export type RoutineHistoryCreateRes = Response<void>;

export type RoutineHistoryExerciseDailySummaryListFetchReq = {
  exerciseId: string | number;
  period: Period;
  type: Type;
};

export type RoutineHistoryExerciseDailySummaryListFetchItem = {
  date: string;
  totalWorkoutTime: number;
  totalWeightLifted: number;
  totalRepCount: number;
};

export type RoutineHistoryExerciseDailySummaryListFetchRes = Response<
  RoutineHistoryExerciseDailySummaryListFetchItem[]
>;
