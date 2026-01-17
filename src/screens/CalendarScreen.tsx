import React, { useCallback, useMemo, useState } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HistoryStackParamList } from '../navigation/types';
import PageLayout from '@/components/PageLayout/PageLayout';
import LineTab from '@/components/LineTab/LineTab';
import { historyTabRoutes } from '@/navigation/routeConfig';
import ERCalendar, { Dot } from '@/components/ERCalendar/ERCalendar';
import ERGraph from '@/components/ERGraph/ERGraph';

const CalendarScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<HistoryStackParamList>>();
  const [date, setDate] = useState<string | null>(null);

  const [hi, setHi] = useState(3);

  const handleChange = useCallback((next: string) => {
    setDate(next);
    Alert.alert(next);
  }, []);

  const dotsByDate = useMemo<Record<string, Dot[]>>(
    () => ({
      '2026-01-01': [
        { key: 'r1', color: '#7C4DFF' },
        { key: 'r2', color: '#FF7043' },
        { key: 'r3', color: '#43A047' },
        { key: 'r4', color: '#000000' }, // ✅ 4개여도 캘린더는 3개만 표시
      ],
      '2026-01-02': [{ key: 'r1', color: '#43A047' }],
    }),
    []
  );

  return (
    <PageLayout
      mode="tab"
      activeTab="History"
      scrollable
      main={
        <>
          <LineTab routes={historyTabRoutes} activeTab="Calendar" />

          <View style={styles.container}>
            <Text style={styles.text}>Calendar Screen</Text>
            <Button
              title="View Record Detail"
              onPress={() => navigation.navigate('HistoryDetail', { recordId: '123' })}
            />
            <ERGraph
              data={[
                { xLabel: '4월 30일', value: 20 },
                { xLabel: '5월 1일', value: 60 },
                { xLabel: '5월 2일', value: 30 },
                { xLabel: '5월 3일', value: 80 },
                { xLabel: '5월 4일', value: 55 },
                { xLabel: '5월 5일', value: 95 },
              ]}
              onHighlightChange={setHi}
              highlightIndex={hi}
            />
            {/* <ERCalendar value={date} onChange={handleChange} dotsByDate={dotsByDate} /> */}
          </View>
        </>
      }
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    marginBottom: 20,
  },
});

export default CalendarScreen;
