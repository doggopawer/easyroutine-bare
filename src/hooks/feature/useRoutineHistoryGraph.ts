import { useState, useCallback, useMemo } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HistoryStackParamList } from '@/navigation/types';
import type { ERGraphPoint } from '@/components/common/ERGraph/ERGraph';

export const useRoutineHistoryGraph = (selectedExerciseId?: string) => {
  const navigation = useNavigation<NativeStackNavigationProp<HistoryStackParamList>>();
  const [highlightIndex, setHighlightIndex] = useState(3);

  const routineHistoryVolumeSeries = useMemo<ERGraphPoint[]>(() => {
    const baseSeries: ERGraphPoint[] = [
      { xLabel: '4월 30일', value: 20 },
      { xLabel: '5월 1일', value: 60 },
      { xLabel: '5월 2일', value: 30 },
      { xLabel: '5월 3일', value: 80 },
      { xLabel: '5월 4일', value: 55 },
      { xLabel: '5월 5일', value: 95 },
    ];

    const randomValue = (base: number) => {
      const variance = 20;
      const min = Math.max(0, base - variance);
      const max = base + variance;
      return Math.floor(min + Math.random() * (max - min + 1));
    };

    return baseSeries.map(point => ({
      xLabel: point.xLabel,
      value: randomValue(point.value),
    }));
  }, [selectedExerciseId]);

  const navigateToDetail = useCallback(() => {
    navigation.navigate('HistoryDetail', { recordId: '123' });
  }, [navigation]);

  return {
    highlightIndex,
    setHighlightIndex,
    routineHistoryVolumeSeries,
    navigateToDetail,
  };
};
