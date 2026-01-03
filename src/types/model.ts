// src/types/routine.ts
// Purpose: Routine-related type definitions

export type Routine = {
  id: string | number;
  order: number;
  name: string;
  color: string;
  routineExercises: RoutineExercise[];
};

export type RoutineExercise = {
  id: string | number;
  order: number;
  exercise: Exercise;
  sets: Set[];
};

export type Exercise = {
  id: string | number;
  name: string;
  image: string | null;
  category: string;
  types: string[];
  isEditable: 1 | 0;
  shareLevel: 1 | 0;
};

export type Set = {
  id: string | number;
  order: number;
  weight?: number | string;
  rep?: number | string;
  exerciseSec?: number;
  restSec: number;
};

export type RoutineHistory = {
  id: string | number;
  order: number;
  name: string;
  color: string;
  workoutTime: number;
  createdAt: string;
  routineExercises: RoutineExercise[];
};

// API request/response types
export type RoutineListReq = {};

export type RoutineListRes = Response<Routine[]>;

// Common Response type
export type Response<T> = {
  result: {
    success: boolean;
    code: string;
    message: string;
  };
  body: T;
  page?: number;
  size?: number;
  total?: number;
  totalPages?: number;
};
