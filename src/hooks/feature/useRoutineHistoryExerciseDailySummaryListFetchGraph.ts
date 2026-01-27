import { useState, useCallback, useMemo, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HistoryStackParamList } from '@/navigation/types';
import type { ERGraphPoint } from '@/components/common/ERGraph/ERGraph';
import { useRoutineHistoryExerciseDailySummaryListFetch } from '@/hooks/common/useRoutineHistoryExerciseDailySummaryListFetch';
import { Period, Type } from '@/types/common';
import type {
  RoutineHistoryExerciseDailySummaryListFetchItem,
  RoutineHistoryExerciseDailySummaryListFetchReq,
} from '@/types/routine-history';

const formatDateLabel = (value: string) => {
  const parts = value.split('-');
  if (parts.length < 3) return value;
  const month = Number(parts[1]);
  const day = Number(parts[2]);
  if (Number.isNaN(month) || Number.isNaN(day)) return value;
  return `${month}월 ${day}일`;
};

const pickMetricValue = (
  item: RoutineHistoryExerciseDailySummaryListFetchItem,
  type: Type
) => {
  switch (type) {
    case Type.WEIGHT:
      return item.totalWeightLifted;
    case Type.COUNT:
      return item.totalRepCount;
    case Type.TIME:
    case Type.REST:
    default:
      return item.totalWorkoutTime;
  }
};

export const useRoutineHistoryExerciseDailySummaryListFetchGraph = (
  selectedExerciseId?: string
) => {
  const navigation = useNavigation<NativeStackNavigationProp<HistoryStackParamList>>();
  const [highlightIndex, setHighlightIndex] = useState(0);

  const [params, setParams] = useState<RoutineHistoryExerciseDailySummaryListFetchReq>(() => ({
    exerciseId: selectedExerciseId ?? '',
    period: Period.MONTH,
    type: Type.WEIGHT,
  }));

  useEffect(() => {
    const nextExerciseId = selectedExerciseId ?? '';
    setParams(prev =>
      prev.exerciseId === nextExerciseId ? prev : { ...prev, exerciseId: nextExerciseId }
    );
  }, [selectedExerciseId]);

  const { res, isFetching, fetchStatus } = useRoutineHistoryExerciseDailySummaryListFetch(params);

  const routineHistoryVolumeSeries = useMemo<ERGraphPoint[]>(() => {
    const body = res?.body ?? [];
    return body.map(item => ({
      xLabel: formatDateLabel(item.date),
      value: pickMetricValue(item, params.type),
    }));
  }, [res, params.type]);

  const navigateToDetail = useCallback(() => {
    navigation.navigate('HistoryDetail', { recordId: '123' });
  }, [navigation]);

  return {
    params,
    setParams,
    highlightIndex,
    setHighlightIndex,
    routineHistoryVolumeSeries,
    isFetching,
    fetchStatus,
    navigateToDetail,
  };
};
