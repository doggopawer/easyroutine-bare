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
import RoutineNavigateToCreateButton from '@/features/routine/navigate/RoutineNavigateToCreateButton';

type Props = NativeStackScreenProps<RoutineStackParamList, 'RoutineList'>;

const RoutineListScreen: React.FC<Props> = ({ navigation, route }) => {
  const [open, setOpen] = useState(false);

  const { res } = useRoutineListQuery({});

  const routineList = res?.body ?? [];

  return (
    <PageLayout
      mode="tab"
      activeTab="Home"
      overlay={({ scrollY }) => (
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
          <RoutineNavigateToCreateButton
            scrollY={scrollY}
            onNavigateToCreatePress={() => navigation.navigate('RoutineCreate')}
          />
        </>
      )}
      main={
        <>
          <RoutineList
            routines={routineList}
            onNavigateToEditPress={routineId => navigation.navigate('RoutineEdit', { routineId })}
            onNavigateToStartPress={routineId =>
              navigation.navigate('RoutineProgress', { routineId })
            }
          />
        </>
      }
    ></PageLayout>
  );
};

export default RoutineListScreen;

// 비즈니스 로직은 페이지 최상단에서 정의하고 프롭스로 내려받는게 맞아
// UI 로직은 각 컴포넌트가 정의를 하는 것이고
// feature 컴포넌트는 그걸 받을 준비가 되어있고, 좀더 묶기 위한 용도
