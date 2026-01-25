import { useCallback, useMemo, useRef, useState } from 'react';
import { ERBottomSheetRef } from '@/components/common/ERBottomSheet/ERBottomSheet';

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

export type ActiveCell = {
  routineExerciseId: string;
  setId: string;
  metric: MetricType;
  value: string;
};

type Params = {
  onConfirmUpdate: (cell: ActiveCell, nextValue: string) => void;
};

export const useSetUpdateBottomSheet = ({ onConfirmUpdate }: Params) => {
  const bottomSheetRef = useRef<ERBottomSheetRef>(null);
  const [activeCell, setActiveCell] = useState<ActiveCell | null>(null);

  const inputKind = useMemo<InputKind | null>(() => {
    if (!activeCell) {
      return null;
    }
    return getInputKind(activeCell.metric);
  }, [activeCell]);

  const openSetUpdateBottomSheet = useCallback((cell: ActiveCell) => {
    setActiveCell(cell);
    bottomSheetRef.current?.open();
  }, []);

  const closeSetUpdateBottomSheet = useCallback(() => {
    bottomSheetRef.current?.close();
    setActiveCell(null);
  }, []);

  const confirmUpdate = useCallback(
    (nextValue: string) => {
      if (!activeCell) {
        return;
      }
      onConfirmUpdate(activeCell, nextValue);
      closeSetUpdateBottomSheet();
    },
    [activeCell, onConfirmUpdate, closeSetUpdateBottomSheet]
  );

  const bottomSheetProps = useMemo(
    () => ({
      bottomSheetRef,
      inputKind,
      defaultValue: activeCell?.value ?? '',
      onClose: closeSetUpdateBottomSheet,
      onCancel: closeSetUpdateBottomSheet,
      onConfirm: confirmUpdate,
    }),
    [activeCell, inputKind, closeSetUpdateBottomSheet, confirmUpdate]
  );

  return {
    activeCell,
    openSetUpdateBottomSheet,
    bottomSheetProps,
  };
};
