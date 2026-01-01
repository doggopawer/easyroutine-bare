import { Routine } from '@/features/app/model/types';
import { Response } from '@/features/app/network/types';

export type RoutineListReq = {};

export type RoutineListItem = Routine;

export type RoutineListRes = Response<RoutineListItem[]>;
