import React, { useRef, useState, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RoutineStackParamList } from '@/navigation/types';
import ERConfirmModal from '@/components/ERConfirmModal/ERConfirmModal';
import { useRoutineListQuery } from '@/hooks/useRoutineListQuery';
import ERFloatingActionButton from '@/components/ERFloatingActionButton/ERFloatingActionButton';
import ERIconTitleSubTitle from '@/components/ERIconTitleSubTitle/ERIconTitleSubTitle';
import { Color } from '@/types/common';
import { VStack } from '@/components/VStack/VStack';
import { HStack } from '@/components/HStack/HStack';
import ERImageTitleSubtitle from '@/components/ERImageTitleSubTitle/ERImageTitleSubTitle';
import ERIconTextButton from '@/components/ERIconTextButton/ERIconTextButton';
import { useTheme } from '@/theme/ThemeProvider/ThemeProvider';
import FireIcon from '@/assets/images/fire.svg';
import ERSwipeableAccordion from '@/components/ERSwipeableAccordion/ERSwipeableAccordion';
import PageLayout from '@/components/PageLayout/PageLayout';

type Props = NativeStackScreenProps<RoutineStackParamList, 'RoutineList'>;

const RoutineListScreen: React.FC<Props> = ({ navigation, route }) => {
  const { theme } = useTheme();
  const [routineDeleteModalOpen, setRoutineDeleteModalOpen] = useState(false);

  const { res } = useRoutineListQuery({});

  const routineList = res?.body ?? [];

  return (
    <PageLayout
      mode="tab"
      activeTab="Home"
      overlay={({ scrollY }) => (
        <>
          <ERConfirmModal
            open={routineDeleteModalOpen}
            onOpenChange={setRoutineDeleteModalOpen}
            title="루틴 삭제"
            description={`루틴을 삭제하시겠습니까?`}
            cancelText="취소"
            confirmText="루틴 삭제"
            onCancel={() => console.log('cancel')}
            onConfirm={() => console.log('confirm')}
          />
          <ERFloatingActionButton
            scrollY={scrollY}
            onButtonClick={() => navigation.navigate('RoutineCreate')}
          />
        </>
      )}
      main={
        <>
          <FlatList
            data={routineList}
            keyExtractor={item => item.id.toString()}
            renderItem={({ item }) => (
              <ERSwipeableAccordion
                key={item.id}
                onDeletePress={() => {
                  setRoutineDeleteModalOpen(true);
                }}
                visible={
                  <ERIconTitleSubTitle
                    title={item.name}
                    countText={item.routineExercises.length.toString()}
                    color={item.color as Color}
                  />
                }
                hidden={
                  <VStack gap={12}>
                    <FlatList
                      data={item.routineExercises}
                      keyExtractor={item => item.id.toString()}
                      renderItem={({ item }) => (
                        <ERImageTitleSubtitle
                          title={item.exercise.name}
                          subtitle={item.sets.length.toString()}
                          imageSrc={item.exercise.image ?? ''}
                        />
                      )}
                      ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                      scrollEnabled={false}
                    />
                    <HStack justify="space-around">
                      <ERIconTextButton
                        color={theme.colors.primary1}
                        icon={<FireIcon />}
                        text="루틴 수정하기"
                        onPress={() =>
                          navigation.navigate('RoutineEdit', { routineId: item.id.toString() })
                        }
                      />
                      <ERIconTextButton
                        color={theme.colors.primary1}
                        icon={<FireIcon />}
                        text="루틴 시작하기"
                        onPress={() =>
                          navigation.navigate('RoutineProgress', { routineId: item.id.toString() })
                        }
                      />
                    </HStack>
                  </VStack>
                }
              />
            )}
            ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
            //   scrollEnabled={true}
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
