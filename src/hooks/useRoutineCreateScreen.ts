import { useCallback, useMemo, useRef, useState } from 'react';
import { useExerciseListQuery } from '@/hooks/useExerciseListQuery';
import { useRoutineCreateMutation } from '@/hooks/useRoutineCreateMuation';
import { Routine, RoutineExercise, Set, Exercise } from '@/types/model';
import { Category } from '@/types/common';
import { ERBottomSheetRef } from '@/components/ui/ERBottomSheet/ERBottomSheet';
import Toast from 'react-native-toast-message';

export type MetricType = 'weight' | 'rep' | 'exerciseSec' | 'restSec';
export type InputKind = 'decimal' | 'integer' | 'duration';

export const getInputKind = (type: MetricType): InputKind => {
  if (type === 'weight') {
    return 'decimal';
  }
  if (type === 'rep') {
    return 'integer';
  }
  return 'duration';
};

type ActiveCell = {
  routineExerciseId: string;
  setId: string;
  metric: MetricType;
  value: string;
};

export const useRoutineCreateScreen = (navigation: { goBack: () => void }) => {
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

  const [exerciseDeleteModalOpen, setExerciseDeleteModalOpen] = useState<boolean>(false);
  const [deleteTargetExerciseId, setDeleteTargetExerciseId] = useState<string | null>(null);
  const [category, setCategory] = useState<Category>(Category.ALL);
  const [search, setSearch] = useState<string>('');
  const [selectedExerciseIds, setSelectedExerciseIds] = useState<string[]>([]);
  const [activeCell, setActiveCell] = useState<ActiveCell | null>(null);

  /* -------------------------------------------------------------------------- */
  /* ✅ Refs                                                                    */
  /* -------------------------------------------------------------------------- */

  const keypadRef = useRef<ERBottomSheetRef>(null);
  const libraryRef = useRef<ERBottomSheetRef>(null);

  /* -------------------------------------------------------------------------- */
  /* ✅ Computed                                                                */
  /* -------------------------------------------------------------------------- */

  const inputKind = useMemo<InputKind | null>(() => {
    if (!activeCell) {
      return null;
    }
    return getInputKind(activeCell.metric);
  }, [activeCell]);

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

  const openKeypad = useCallback((cell: ActiveCell) => {
    setActiveCell(cell);
    keypadRef.current?.open();
  }, []);

  const closeKeypad = useCallback(() => {
    keypadRef.current?.close();
    setActiveCell(null);
  }, []);

  const openLibrary = useCallback(() => {
    libraryRef.current?.open();
  }, []);

  const closeLibrary = useCallback(() => {
    libraryRef.current?.close();
  }, []);

  const handleKeyPadConfirm = useCallback(
    (next: string) => {
      if (!activeCell) {
        return;
      }

      setRoutine((prev: Routine) => {
        const nextRoutineExercises: RoutineExercise[] = prev.routineExercises.map(
          (re: RoutineExercise) => {
            if (String(re.id) !== activeCell.routineExerciseId) {
              return re;
            }

            const nextSets: Set[] = re.sets.map((s: Set) => {
              if (String(s.id) !== activeCell.setId) {
                return s;
              }

              if (activeCell.metric === 'weight') {
                return { ...s, weight: next };
              }
              if (activeCell.metric === 'rep') {
                return { ...s, rep: next };
              }
              if (activeCell.metric === 'exerciseSec') {
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

      closeKeypad();
    },
    [activeCell, closeKeypad, parseDurationToSec]
  );

  const handleExerciseDeleteConfirm = useCallback(() => {
    if (!deleteTargetExerciseId) {
      return;
    }

    setRoutine(prev => ({
      ...prev,
      routineExercises: prev.routineExercises.filter(
        re => String(re.id) !== deleteTargetExerciseId
      ),
    }));

    setDeleteTargetExerciseId(null);
  }, [deleteTargetExerciseId]);

  const handleAddExercisesToRoutine = useCallback(() => {
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

    setSelectedExerciseIds([]);
    closeLibrary();
  }, [selectedExerciseIds, exerciseList, closeLibrary]);

  const handleCreateRoutine = useCallback(async () => {
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
    exerciseDeleteModalOpen,
    setExerciseDeleteModalOpen,
    setDeleteTargetExerciseId,
    category,
    setCategory,
    search,
    setSearch,
    selectedExerciseIds,
    setSelectedExerciseIds,
    activeCell,
    routineExercises,

    // Refs
    keypadRef,
    libraryRef,

    // Computed
    inputKind,

    // Handlers
    openKeypad,
    closeKeypad,
    openLibrary,
    closeLibrary,
    getCellValue,
    handleKeyPadConfirm,
    handleExerciseDeleteConfirm,
    handleAddExercisesToRoutine,
    handleCreateRoutine,
  };
};
