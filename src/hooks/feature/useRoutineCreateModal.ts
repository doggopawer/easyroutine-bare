import { useCallback, useMemo, useState } from 'react';
import { useExerciseListQuery } from '@/hooks/common/useExerciseListQuery';
import { useRoutineCreateMutation } from '@/hooks/common/useRoutineCreateMuation';
import { Routine, RoutineExercise, Set, Exercise } from '@/types/model';
import Toast from 'react-native-toast-message';
import { ActiveCell, MetricType } from '@/hooks/feature/useSetUpdateBottomSheet';

export const useRoutineCreateModal = (navigation: { goBack: () => void }) => {
  const { res } = useExerciseListQuery({});
  const { mutateAsync: createRoutineMutate } = useRoutineCreateMutation();

  const exerciseList = useMemo(() => res?.body ?? [], [res]);

  /* -------------------------------------------------------------------------- */
  /* ✅ State                                                                   */
  /* -------------------------------------------------------------------------- */

  const [routine, setRoutine] = useState<Routine>({
    id: `routine-${Date.now()}`,
    order: 1,
    name: '새 루틴',
    color: '#855CF8',
    routineExercises: [],
  });

  const routineExercises = routine.routineExercises;

  /* -------------------------------------------------------------------------- */
  /* ✅ Helpers                                                                 */
  /* -------------------------------------------------------------------------- */

  const formatDuration = useCallback((sec?: number) => {
    const s = sec ?? 0;
    const mm = String(Math.floor(s / 60)).padStart(2, '0');
    const ss = String(s % 60).padStart(2, '0');
    return `${mm}:${ss}`;
  }, []);

  const parseDurationToSec = useCallback((value: string) => {
    const [mmRaw, ssRaw] = value.split(':');
    const mm = Number(mmRaw);
    const ss = Number(ssRaw);
    if (Number.isNaN(mm) || Number.isNaN(ss)) {
      return 0;
    }
    return mm * 60 + ss;
  }, []);

  const getCellValue = useCallback(
    (set: Set, metric: MetricType) => {
      if (metric === 'weight') {
        return String(set.weight ?? '');
      }
      if (metric === 'rep') {
        return String(set.rep ?? '');
      }
      if (metric === 'exerciseSec') {
        return formatDuration(set.exerciseSec);
      }
      return formatDuration(set.restSec);
    },
    [formatDuration]
  );

  /* -------------------------------------------------------------------------- */
  /* ✅ Handlers                                                                */
  /* -------------------------------------------------------------------------- */

  const updateRoutineSetValue = useCallback(
    (cell: ActiveCell, next: string) => {
      setRoutine((prev: Routine) => {
        const nextRoutineExercises: RoutineExercise[] = prev.routineExercises.map(
          (re: RoutineExercise) => {
            if (String(re.id) !== cell.routineExerciseId) {
              return re;
            }

            const nextSets: Set[] = re.sets.map((s: Set) => {
              if (String(s.id) !== cell.setId) {
                return s;
              }

              if (cell.metric === 'weight') {
                return { ...s, weight: next };
              }
              if (cell.metric === 'rep') {
                return { ...s, rep: next };
              }
              if (cell.metric === 'exerciseSec') {
                return { ...s, exerciseSec: parseDurationToSec(next) };
              }

              return { ...s, restSec: parseDurationToSec(next) };
            });

            return { ...re, sets: nextSets };
          }
        );

        return {
          ...prev,
          routineExercises: nextRoutineExercises,
        };
      });
    },
    [parseDurationToSec]
  );

  const deleteExercise = useCallback((exerciseId: string) => {
    setRoutine(prev => ({
      ...prev,
      routineExercises: prev.routineExercises.filter(re => String(re.id) !== exerciseId),
    }));
  }, []);

  const addExercisesToRoutine = useCallback(
    (selectedExerciseIds: string[]) => {
      if (selectedExerciseIds.length === 0) {
        return;
      }

      const selectedExercises = exerciseList.filter(ex =>
        selectedExerciseIds.includes(String(ex.id))
      );

      setRoutine(prev => {
        const nextOrderStart = prev.routineExercises.length + 1;

        const nextRoutineExercises: RoutineExercise[] = selectedExercises.map((exercise, idx) => ({
          id: `routine-ex-${Date.now()}-${idx}`,
          order: nextOrderStart + idx,
          exercise: exercise as Exercise,
          sets: [
            {
              id: `set-${Date.now()}-${idx}-1`,
              order: 1,
              weight: 0,
              rep: 0,
              exerciseSec: 0,
              restSec: 60,
            },
          ],
        }));

        return {
          ...prev,
          routineExercises: [...prev.routineExercises, ...nextRoutineExercises],
        };
      });
    },
    [exerciseList]
  );

  const createRoutine = useCallback(async () => {
    try {
      await createRoutineMutate(routine);

      Toast.show({
        type: 'success',
        text1: '생성 완료',
        text2: '루틴이 생성되었습니다.',
      });

      navigation.goBack();
    } catch (e) {
      Toast.show({
        type: 'error',
        text1: '생성 실패',
        text2: '잠시 후 다시 시도해주세요.',
      });

      console.error(e);
    }
  }, [createRoutineMutate, routine, navigation]);

  return {
    // State
    routine,
    exerciseList,
    routineExercises,

    // Handlers
    getCellValue,
    updateRoutineSetValue,
    deleteExercise,
    addExercisesToRoutine,
    createRoutine,
  };
};
