import { Response } from './common';
import { Routine } from './model';

// API request/response types
export type RoutineListReq = {};

export type RoutineListRes = Response<Routine[]>;

export type RoutineDeleteReq = {
  routineId: string;
};

export type RoutineDeleteRes = Response<void>;
