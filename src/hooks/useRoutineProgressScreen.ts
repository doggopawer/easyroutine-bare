import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTheme } from '@/theme/ThemeProvider/ThemeProvider';
import { Routine, RoutineExercise, Set, RoutineHistory, Exercise } from '@/types/model';
import { useExerciseListQuery } from '@/hooks/useExerciseListQuery';
import { useRoutineHistoryCreateMutation } from '@/hooks/useRoutineHistoryCreateMutation';
import Toast from 'react-native-toast-message';
import { ActiveCell, MetricType } from '@/hooks/useSetUpdateBottomSheet';

type DoneMap = Record<string, Record<string, boolean>>;

const isDoneSet = (doneMap: DoneMap, routineExerciseId: string, setId: string) =>
  !!doneMap[routineExerciseId]?.[setId];

const formatDuration = (sec?: number) => {
  const s = sec ?? 0;
  const mm = String(Math.floor(s / 60)).padStart(2, '0');
  const ss = String(s % 60).padStart(2, '0');
  return `${mm}:${ss}`;
};

const parseDurationToSec = (value: string) => {
  const [mmRaw, ssRaw] = value.split(':');
  const mm = Number(mmRaw);
  const ss = Number(ssRaw);
  if (Number.isNaN(mm) || Number.isNaN(ss)) {
    return 0;
  }
  return mm * 60 + ss;
};

const createNewSet = (order: number): Set => ({
  id: `set-${Date.now()}-${Math.random()}`,
  order,
  weight: 0,
  rep: 0,
  exerciseSec: 0,
  restSec: 60,
});

export const useRoutineProgressScreen = (
  initialRoutine: Routine,
  navigation: { goBack: () => void }
) => {
  const { theme } = useTheme();
  const { res } = useExerciseListQuery({});
  const { mutateAsync: createRoutineHistoryMutate } = useRoutineHistoryCreateMutation();

  const exerciseList = useMemo(() => res?.body ?? [], [res]);

  /* -------------------------------------------------------------------------- */
  /* ✅ State                                                                   */
  /* -------------------------------------------------------------------------- */

  const [routine, setRoutine] = useState<Routine>(initialRoutine);

  const [activeSet, setActiveSet] = useState<{
    routineExerciseId: string;
    setId: string;
  } | null>(() => {
    const firstExercise = initialRoutine.routineExercises[0];
    if (!firstExercise) {
      return null;
    }
    const firstSet = firstExercise.sets[0];
    if (!firstSet) {
      return null;
    }

    return {
      routineExerciseId: String(firstExercise.id),
      setId: String(firstSet.id),
    };
  });

  const [doneMap, setDoneMap] = useState<DoneMap>({});

  const [restTimerOpen, setRestTimerOpen] = useState<boolean>(false);
  const [restRemain, setRestRemain] = useState<number>(0);
  const [restRunning, setRestRunning] = useState<boolean>(false);

  const [routineHistory, setRoutineHistory] = useState<RoutineHistory>(() => ({
    id: `history-${Date.now()}`,
    order: routine.order,
    name: routine.name,
    color: routine.color,
    workoutTime: 0,
    createdAt: new Date().toISOString(),
    routineExercises: [],
  }));

  const [routineFinishConfirmOpen, setRoutineFinishConfirmOpen] = useState<boolean>(false);
  const [routineFinishWarningOpen, setRoutineFinishWarningOpen] = useState<boolean>(false);

  /* -------------------------------------------------------------------------- */
  /* ✅ Effects                                                                 */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    if (!restRunning) {
      return;
    }

    const timer = setInterval(() => {
      setRestRemain(prev => {
        if (prev <= 1) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [restRunning]);

  /* -------------------------------------------------------------------------- */
  /* ✅ Computed                                                                */
  /* -------------------------------------------------------------------------- */

  const totalSetCount = useMemo(
    () => routine.routineExercises.reduce((acc, re) => acc + re.sets.length, 0),
    [routine]
  );

  const doneSetCount = useMemo(() => {
    let count = 0;
    routine.routineExercises.forEach(re => {
      re.sets.forEach(s => {
        if (isDoneSet(doneMap, String(re.id), String(s.id))) {
          count += 1;
        }
      });
    });
    return count;
  }, [routine, doneMap]);

  const isAllDone = useMemo(
    () => totalSetCount > 0 && doneSetCount === totalSetCount,
    [totalSetCount, doneSetCount]
  );

  const bottomTimerTextColor = useMemo(() => {
    if (!restRunning) {
      return theme.colors.text;
    }
    return restRemain <= 10 ? theme.colors.red1 : theme.colors.text;
  }, [restRunning, restRemain, theme.colors.red1, theme.colors.text]);

  /* -------------------------------------------------------------------------- */
  /* ✅ Helpers                                                                 */
  /* -------------------------------------------------------------------------- */

  const getCellValue = useCallback((set: Set, metric: MetricType) => {
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
  }, []);

  const pushDoneSetToHistory = useCallback((routineExercise: RoutineExercise, set: Set) => {
    setRoutineHistory(prev => {
      const reId = String(routineExercise.id);
      const setId = String(set.id);

      const alreadySaved = prev.routineExercises.some(
        re => String(re.id) === reId && re.sets.some(s => String(s.id) === setId)
      );
      if (alreadySaved) {
        return prev;
      }

      const hasExercise = prev.routineExercises.some(re => String(re.id) === reId);

      if (hasExercise) {
        const nextRoutineExercises = prev.routineExercises.map(re => {
          if (String(re.id) !== reId) {
            return re;
          }
          return { ...re, sets: [...re.sets, set] };
        });

        return { ...prev, routineExercises: nextRoutineExercises };
      }

      return {
        ...prev,
        routineExercises: [...prev.routineExercises, { ...routineExercise, sets: [set] }],
      };
    });
  }, []);

  /* -------------------------------------------------------------------------- */
  /* ✅ Handlers                                                                */
  /* -------------------------------------------------------------------------- */

  const handleUpdateRoutineSetValue = useCallback(
    (cell: ActiveCell, next: string) => {
      setRoutine(prev => {
        const nextRoutineExercises = prev.routineExercises.map(re => {
          if (String(re.id) !== cell.routineExerciseId) {
            return re;
          }

          const nextSets = re.sets.map(s => {
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
        });

        return { ...prev, routineExercises: nextRoutineExercises };
      });
    },
    []
  );

  const moveNext = useCallback(() => {
    if (!activeSet) {
      return;
    }

    const reIndex = routine.routineExercises.findIndex(
      re => String(re.id) === activeSet.routineExerciseId
    );
    if (reIndex === -1) {
      return;
    }

    const currentExercise = routine.routineExercises[reIndex];
    const setIndex = currentExercise.sets.findIndex(s => String(s.id) === activeSet.setId);
    if (setIndex === -1) {
      return;
    }

    const nextSet = currentExercise.sets[setIndex + 1];
    if (nextSet) {
      setActiveSet({
        routineExerciseId: String(currentExercise.id),
        setId: String(nextSet.id),
      });
      return;
    }

    const nextExercise = routine.routineExercises[reIndex + 1];
    if (nextExercise?.sets[0]) {
      setActiveSet({
        routineExerciseId: String(nextExercise.id),
        setId: String(nextExercise.sets[0].id),
      });
      return;
    }

    setRoutineFinishConfirmOpen(true);
    setActiveSet(null);
  }, [activeSet, routine]);

  useEffect(() => {
    if (!restRunning) {
      return;
    }
    if (restRemain !== 0) {
      return;
    }

    setRestRunning(false);
    setRestTimerOpen(false);
    moveNext();
  }, [restRemain, restRunning, moveNext]);

  const handleRestTempClose = useCallback(() => {
    setRestTimerOpen(false);
  }, []);

  const handleRestSkip = useCallback(() => {
    setRestRunning(false);
    setRestTimerOpen(false);
    setRestRemain(0);
    moveNext();
  }, [moveNext]);


  const handleSetDone = useCallback(() => {
    if (!activeSet) {
      return;
    }

    const currentExercise = routine.routineExercises.find(
      re => String(re.id) === activeSet.routineExerciseId
    );
    if (!currentExercise) {
      return;
    }

    const currentSet = currentExercise.sets.find(s => String(s.id) === activeSet.setId);
    if (!currentSet) {
      return;
    }

    const reId = String(currentExercise.id);
    const setId = String(currentSet.id);

    setDoneMap(prev => ({
      ...prev,
      [reId]: { ...(prev[reId] ?? {}), [setId]: true },
    }));

    pushDoneSetToHistory(currentExercise, currentSet);

    setTimeout(() => {
      const isLastSetOfExercise =
        currentExercise.sets[currentExercise.sets.length - 1]?.id === currentSet.id;

      const isLastExercise =
        routine.routineExercises[routine.routineExercises.length - 1]?.id === currentExercise.id;

      const isLastSetOfRoutine = isLastSetOfExercise && isLastExercise;

      if (isLastSetOfRoutine) {
        setActiveSet(null);
        setRoutineFinishConfirmOpen(true);
        return;
      }

      setRestRemain(currentSet.restSec);
      setRestRunning(true);
      setRestTimerOpen(true);
    }, 0);
  }, [activeSet, routine, pushDoneSetToHistory]);

  const handleAddSet = useCallback((routineExerciseId: string) => {
    let createdSetId = '';

    setRoutine(prev => {
      const nextRoutineExercises = prev.routineExercises.map(re => {
        if (String(re.id) !== routineExerciseId) {
          return re;
        }

        const nextOrder = re.sets.length + 1;
        const newSet = createNewSet(nextOrder);
        createdSetId = String(newSet.id);

        return { ...re, sets: [...re.sets, newSet] };
      });

      return { ...prev, routineExercises: nextRoutineExercises };
    });

    setTimeout(() => {
      setActiveSet(prev => {
        if (prev !== null) {
          return prev;
        }
        return { routineExerciseId, setId: createdSetId };
      });
    }, 0);
  }, []);

  const handleDeleteSet = useCallback(
    (routineExerciseId: string) => {
      const targetExercise = routine.routineExercises.find(
        re => String(re.id) === routineExerciseId
      );
      if (!targetExercise) {
        return;
      }
      if (targetExercise.sets.length <= 1) {
        return;
      }

      const deletedSet = targetExercise.sets[targetExercise.sets.length - 1];
      const deletedSetId = String(deletedSet.id);
      const reId = String(targetExercise.id);

      setRoutine(prev => {
        const nextRoutineExercises = prev.routineExercises.map(re => {
          if (String(re.id) !== routineExerciseId) {
            return re;
          }
          if (re.sets.length <= 1) {
            return re;
          }

          const nextSets = re.sets.slice(0, -1);
          return { ...re, sets: nextSets.map((s, idx) => ({ ...s, order: idx + 1 })) };
        });

        return { ...prev, routineExercises: nextRoutineExercises };
      });

      setDoneMap(prev => {
        const next = { ...prev };
        const exerciseDoneMap = { ...(next[reId] ?? {}) };
        delete exerciseDoneMap[deletedSetId];
        next[reId] = exerciseDoneMap;
        return next;
      });

      if (activeSet?.routineExerciseId === routineExerciseId && activeSet?.setId === deletedSetId) {
        const prevSet = targetExercise.sets[targetExercise.sets.length - 2];
        if (prevSet) {
          setActiveSet({
            routineExerciseId,
            setId: String(prevSet.id),
          });
        }
      }
    },
    [routine, activeSet]
  );

  const handleAddExercisesToRoutine = useCallback(
    (selectedExerciseIds: string[]) => {
      if (selectedExerciseIds.length === 0) {
        return;
      }

      const selectedExercises: Exercise[] = exerciseList.filter(ex =>
        selectedExerciseIds.includes(String(ex.id))
      );

      setRoutine(prev => {
        const nextOrderStart = prev.routineExercises.length + 1;

        const nextRoutineExercises: RoutineExercise[] = selectedExercises.map((exercise, idx) => ({
          id: `routine-ex-${Date.now()}-${idx}`,
          order: nextOrderStart + idx,
          exercise,
          sets: [createNewSet(1)],
        }));

        return { ...prev, routineExercises: [...prev.routineExercises, ...nextRoutineExercises] };
      });
    },
    [exerciseList]
  );

  const handleConfirmRoutineFinish = useCallback(async () => {
    try {
      await createRoutineHistoryMutate(routineHistory);

      Toast.show({
        type: 'success',
        text1: '루틴 완료!',
        text2: '기록이 저장되었습니다.',
      });

      navigation.goBack();
    } catch (e) {
      Toast.show({
        type: 'error',
        text1: '저장 실패',
        text2: '잠시 후 다시 시도해주세요.',
      });

      console.error(e);
    }
  }, [createRoutineHistoryMutate, routineHistory, navigation]);

  return {
    // State
    routine,
    activeSet,
    doneMap,
    restTimerOpen,
    setRestTimerOpen,
    restRemain,
    restRunning,
    routineFinishConfirmOpen,
    setRoutineFinishConfirmOpen,
    routineFinishWarningOpen,
    setRoutineFinishWarningOpen,
    exerciseList,
    totalSetCount,
    doneSetCount,
    isAllDone,
    bottomTimerTextColor,

    // Helpers
    isDoneSet,
    getCellValue,
    formatDuration,

    // Handlers
    handleUpdateRoutineSetValue,
    handleRestTempClose,
    handleRestSkip,
    handleSetDone,
    handleAddSet,
    handleDeleteSet,
    handleAddExercisesToRoutine,
    handleConfirmRoutineFinish,
  };
};
