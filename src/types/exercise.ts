import { Response } from './common';
import { Exercise } from './model';

// API request/response types
export type ExerciseListReq = {};

export type ExerciseListRes = Response<Exercise[]>;

export type ExerciseDeleteReq = {
  exerciseId: string;
};

export type ExerciseDeleteRes = Response<void>;
