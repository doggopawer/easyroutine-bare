import React, { useState } from 'react';
import { View, FlatList } from 'react-native';
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
import { useRoutineDeleteMutation } from '@/hooks/useRoutineDeleteMutation';

type Props = NativeStackScreenProps<RoutineStackParamList, 'RoutineList'>;

const RoutineListScreen: React.FC<Props> = ({ navigation }) => {
  const { theme } = useTheme();

  const [routineDeleteModalOpen, setRoutineDeleteModalOpen] = useState(false);

  // ✅ 삭제할 루틴 ID 저장
  const [deleteTargetRoutineId, setDeleteTargetRoutineId] = useState<string | null>(null);

  const { res } = useRoutineListQuery({});
  const { mutateAsync: deleteRoutineMutate } = useRoutineDeleteMutation();

  const routineList = res?.body ?? [];

  const handleCloseDeleteModal = () => {
    setRoutineDeleteModalOpen(false);
    setDeleteTargetRoutineId(null);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTargetRoutineId) return;

    await deleteRoutineMutate({ routineId: deleteTargetRoutineId });

    // ✅ 삭제 성공 후 모달 닫고 상태 초기화
    handleCloseDeleteModal();
  };

  return (
    <PageLayout
      mode="tab"
      activeTab="Home"
      overlay={({ scrollY }) => (
        <>
          <ERConfirmModal
            open={routineDeleteModalOpen}
            onOpenChange={next => {
              setRoutineDeleteModalOpen(next);
              if (!next) setDeleteTargetRoutineId(null);
            }}
            title="루틴 삭제"
            description="루틴을 삭제하시겠습니까?"
            cancelText="취소"
            confirmText="루틴 삭제"
            onConfirm={handleConfirmDelete}
            onCancel={handleCloseDeleteModal}
            accentColor={theme.colors.red1} // ✅ 삭제니까 빨간색 강조 (ERConfirmModal에서 지원해야 함)
          />

          <ERFloatingActionButton
            scrollY={scrollY}
            onButtonClick={() => navigation.navigate('RoutineCreate')}
          />
        </>
      )}
      main={
        <FlatList
          data={routineList}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <ERSwipeableAccordion
              key={item.id}
              onDeletePress={() => {
                setDeleteTargetRoutineId(item.id.toString()); // ✅ 삭제 대상 저장
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
                    keyExtractor={ex => ex.id.toString()}
                    renderItem={({ item: ex }) => (
                      <ERImageTitleSubtitle
                        title={ex.exercise.name}
                        subtitle={`${ex.sets.length} 세트`}
                        imageSrc={ex.exercise.image ?? ''}
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
                        navigation.navigate('RoutineEdit', {
                          routineId: item.id.toString(),
                          routine: item,
                        })
                      }
                    />

                    <ERIconTextButton
                      color={theme.colors.primary1}
                      icon={<FireIcon />}
                      text="루틴 시작하기"
                      onPress={() =>
                        navigation.navigate('RoutineProgress', {
                          routineId: item.id.toString(),
                          routine: item,
                        })
                      }
                    />
                  </HStack>
                </VStack>
              }
            />
          )}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        />
      }
    />
  );
};

export default RoutineListScreen;
