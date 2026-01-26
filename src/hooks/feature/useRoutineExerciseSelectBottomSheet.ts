import { useCallback, useMemo, useRef, useState } from 'react';
import type { RefObject } from 'react';
import { ERBottomSheetRef } from '@/components/common/ERBottomSheet/ERBottomSheet';
import { useExerciseListQuery } from '@/hooks/common/useExerciseListQuery';
import { Category } from '@/types/common';
import type { Exercise } from '@/types/model';

type RoutineExerciseSelectBottomSheetState = {
  bottomSheetRef: RefObject<ERBottomSheetRef>;
  category: Category;
  onChangeCategory: (next: Category) => void;
  search: string;
  onChangeSearch: (next: string) => void;
  exerciseList: Exercise[];
  selectedExerciseId: string;
  onSelectExercise: (exerciseId: string) => void;
  onClose: () => void;
};

export const useRoutineExerciseSelectBottomSheet = () => {
  const bottomSheetRef = useRef<ERBottomSheetRef>(null);
  const { res } = useExerciseListQuery({});
  const exerciseList = useMemo(() => res?.body ?? [], [res]);

  const [category, setCategory] = useState<Category>(Category.ALL);
  const [search, setSearch] = useState<string>('');
  const [selectedExerciseId, setSelectedExerciseId] = useState<string>('');

  const filteredExerciseList = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return exerciseList.filter(exercise => {
      const matchesCategory =
        category === Category.ALL || String(exercise.category) === String(category);
      const matchesSearch =
        keyword.length === 0 || (exercise.name ?? '').toLowerCase().includes(keyword);

      return matchesCategory && matchesSearch;
    });
  }, [exerciseList, category, search]);

  const openRoutineExerciseSelectBottomSheet = useCallback(() => {
    bottomSheetRef.current?.open();
  }, []);

  const closeRoutineExerciseSelectBottomSheet = useCallback(() => {
    bottomSheetRef.current?.close();
  }, []);

  const selectExercise = useCallback(
    (exerciseId: string) => {
      setSelectedExerciseId(exerciseId);
      closeRoutineExerciseSelectBottomSheet();
    },
    [closeRoutineExerciseSelectBottomSheet]
  );

  const bottomSheetProps = useMemo<RoutineExerciseSelectBottomSheetState>(
    () => ({
      bottomSheetRef,
      category,
      onChangeCategory: setCategory,
      search,
      onChangeSearch: setSearch,
      exerciseList: filteredExerciseList,
      selectedExerciseId,
      onSelectExercise: selectExercise,
      onClose: closeRoutineExerciseSelectBottomSheet,
    }),
    [
      bottomSheetRef,
      category,
      search,
      filteredExerciseList,
      selectedExerciseId,
      selectExercise,
      closeRoutineExerciseSelectBottomSheet,
    ]
  );

  return {
    selectedExerciseId,
    openRoutineExerciseSelectBottomSheet,
    bottomSheetProps,
  };
};

export type { RoutineExerciseSelectBottomSheetState };
