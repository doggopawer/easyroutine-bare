import { useState, useCallback, useMemo } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HistoryStackParamList } from '@/navigation/types';
import { Dot } from '@/components/common/ERCalendar/ERCalendar';

export const useCalendarContent = () => {
  const navigation = useNavigation<NativeStackNavigationProp<HistoryStackParamList>>();
  const [date, setDate] = useState<string | null>(null);
  const [highlightIndex, setHighlightIndex] = useState(3);

  const changeDate = useCallback((next: string) => {
    setDate(next);
    Alert.alert(next);
  }, []);

  const dotsByDate = useMemo<Record<string, Dot[]>>(
    () => ({
      '2026-01-01': [
        { key: 'r1', color: '#7C4DFF' },
        { key: 'r2', color: '#FF7043' },
        { key: 'r3', color: '#43A047' },
        { key: 'r4', color: '#000000' },
      ],
      '2026-01-02': [{ key: 'r1', color: '#43A047' }],
    }),
    []
  );

  const navigateToDetail = useCallback(() => {
    navigation.navigate('HistoryDetail', { recordId: '123' });
  }, [navigation]);

  return {
    date,
    highlightIndex,
    setHighlightIndex,
    dotsByDate,
    changeDate,
    navigateToDetail,
  };
};
