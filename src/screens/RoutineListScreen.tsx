import React, { useRef, useState, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RoutineStackParamList } from '@/navigation/types';
import PageLayout from '@/components/Layout/PageLayout';
import ERConfirmModal from '@/headful/ERConfirmModal/ERConfirmModal';
import ERSwipeableAccordion from '@/headful/ERSwipeableAccordion';
import RoutineSummary from '@/features/routine/list/components/RoutineSummary';
import RoutineExerciseList from '@/features/routine-exercise/list/RoutineExerciseList';
import { useRoutineListQuery } from '@/features/routine/list/logic/query';
import RoutineList from '@/features/routine/list/components/RoutineList';

type Props = NativeStackScreenProps<RoutineStackParamList, 'RoutineList'>;

const RoutineListScreen: React.FC<Props> = ({ navigation }) => {
  const [open, setOpen] = useState(false);

  const { res } = useRoutineListQuery({});

  const routineList = res?.body ?? [];

  return (
    <PageLayout
      mode="tab"
      activeTab="Home"
      overlay={() => (
        <>
          <ERConfirmModal
            open={open}
            onOpenChange={setOpen}
            title="루틴 미완료"
            description={
              '이 페이지를 벗어나면 지금까지 진행한 운동만\n캘린더에 저장됩니다. 운동을 종료하시겠습니까?'
            }
            cancelText="취소"
            confirmText="운동 종료하기"
            onCancel={() => console.log('cancel')}
            onConfirm={() => console.log('confirm')}
          />
        </>
      )}
      main={
        <>
          <RoutineList routines={routineList} />
        </>
      }
    ></PageLayout>
  );
};

export default RoutineListScreen;
