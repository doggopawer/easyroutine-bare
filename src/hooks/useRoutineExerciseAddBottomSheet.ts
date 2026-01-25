import { useCallback, useMemo, useRef, useState } from 'react';
import type { RefObject } from 'react';
import { ERBottomSheetRef } from '@/components/ui/ERBottomSheet/ERBottomSheet';
import { Category } from '@/types/common';

type Params = {
  onConfirmAdd: (selectedExerciseIds: string[]) => void;
};

type RoutineExerciseAddBottomSheetState = {
  bottomSheetRef: RefObject<ERBottomSheetRef>;
  category: Category;
  onChangeCategory: (next: Category) => void;
  search: string;
  onChangeSearch: (next: string) => void;
  selectedExerciseIds: string[];
  onChangeSelectedExerciseIds: (next: string[]) => void;
  onClose: () => void;
  onConfirmAdd: () => void;
};

export const useRoutineExerciseAddBottomSheet = ({ onConfirmAdd }: Params) => {
  const bottomSheetRef = useRef<ERBottomSheetRef>(null);
  const [category, setCategory] = useState<Category>(Category.ALL);
  const [search, setSearch] = useState<string>('');
  const [selectedExerciseIds, setSelectedExerciseIds] = useState<string[]>([]);

  const openRoutineExerciseAddBottomSheet = useCallback(() => {
    bottomSheetRef.current?.open();
  }, []);

  const closeRoutineExerciseAddBottomSheet = useCallback(() => {
    bottomSheetRef.current?.close();
  }, []);

  const handleConfirmAdd = useCallback(() => {
    if (selectedExerciseIds.length === 0) {
      return;
    }

    onConfirmAdd(selectedExerciseIds);
    setSelectedExerciseIds([]);
    closeRoutineExerciseAddBottomSheet();
  }, [selectedExerciseIds, onConfirmAdd, closeRoutineExerciseAddBottomSheet]);

  const bottomSheetProps = useMemo<RoutineExerciseAddBottomSheetState>(
    () => ({
      bottomSheetRef,
      category,
      onChangeCategory: setCategory,
      search,
      onChangeSearch: setSearch,
      selectedExerciseIds,
      onChangeSelectedExerciseIds: setSelectedExerciseIds,
      onClose: closeRoutineExerciseAddBottomSheet,
      onConfirmAdd: handleConfirmAdd,
    }),
    [
      bottomSheetRef,
      category,
      search,
      selectedExerciseIds,
      closeRoutineExerciseAddBottomSheet,
      handleConfirmAdd,
    ]
  );

  return {
    openRoutineExerciseAddBottomSheet,
    bottomSheetProps,
  };
};
