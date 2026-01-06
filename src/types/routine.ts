import { Response } from './common';
import { Routine } from './model';

// API request/response types
export type RoutineListReq = {};

export type RoutineListRes = Response<Routine[]>;

export type RoutineDeleteReq = {
  routineId: string;
};

export type RoutineDeleteRes = Response<void>;

export type RoutineCreateReq = Routine;

export type RoutineCreateRes = Response<void>;

export type RoutineUpdateReq = Routine;

export type RoutineUpdateRes = Response<void>;
