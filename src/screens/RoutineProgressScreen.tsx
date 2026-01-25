import React, { useCallback } from 'react';
import { FlatList, View, Pressable, Text, StyleSheet } from 'react-native';
import PageLayout from '@/components/common/PageLayout/PageLayout';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RoutineStackParamList } from '@/navigation/types';
import { RoutineExercise, Set } from '@/types/model';
import { VStack } from '@/components/common/VStack/VStack';
import { HStack } from '@/components/common/HStack/HStack';
import { useTheme } from '@/theme/ThemeProvider/ThemeProvider';
import ERSwipeableAccordion from '@/components/common/ERSwipeableAccordion/ERSwipeableAccordion';
import ERImageTitleSubtitle from '@/components/common/ERImageTitleSubTitle/ERImageTitleSubTitle';
import ERTable from '@/components/common/ERTable/ERTable';
import ERFloatingActionButton from '@/components/common/ERFloatingActionButton/ERFloatingActionButton';
import ERButton from '@/components/common/ERButton/ERButton';
import { useRoutineProgressModal } from '@/hooks/feature/useRoutineProgressModal';
import SetUpdateBottomSheet from '@/components/feature/SetUpdateBottomSheet/SetUpdateBottomSheet';
import { useSetUpdateBottomSheet } from '@/hooks/feature/useSetUpdateBottomSheet';
import RoutineExerciseAddBottomSheet from '@/components/feature/RoutineExerciseAddBottomSheet/RoutineExerciseAddBottomSheet';
import { useRoutineExerciseAddBottomSheet } from '@/hooks/feature/useRoutineExerciseAddBottomSheet';
import RoutineRestTimerModal from '@/components/feature/RoutineRestTimerModal/RoutineRestTimerModal';
import RoutineFinishConfirmModal from '@/components/feature/RoutineFinishConfirmModal/RoutineFinishConfirmModal';
import RoutineFinishWarningModal from '@/components/feature/RoutineFinishWarningModal/RoutineFinishWarningModal';

/* -------------------------------------------------------------------------- */
/* ✅ 타입 정의                                                                */
/* -------------------------------------------------------------------------- */

type Props = NativeStackScreenProps<RoutineStackParamList, 'RoutineProgress'>;

const RoutineProgressScreen: React.FC<Props> = ({ navigation, route }) => {
  const { theme } = useTheme();
  const { routine: initialRoutine } = route.params;

  const {
    // State
    routine,
    activeSet,
    doneMap,
    restTimerOpen,
    setRestTimerOpen,
    restRemain,
    restRunning,
    routineFinishConfirmOpen,
    setRoutineFinishConfirmOpen,
    routineFinishWarningOpen,
    setRoutineFinishWarningOpen,
    exerciseList,
    totalSetCount,
    doneSetCount,
    isAllDone,
    bottomTimerTextColor,

    // Helpers
    isDoneSet,
    getCellValue,
    formatDuration,

    // Handlers
    updateRoutineSetValue,
    closeRestTimerTemp,
    skipRest,
    completeSet,
    addSet,
    deleteSet,
    addExercisesToRoutine,
    confirmRoutineFinish,
  } = useRoutineProgressModal(initialRoutine, navigation);

  const { activeCell, openSetUpdateBottomSheet, bottomSheetProps: setUpdateBottomSheetProps } =
    useSetUpdateBottomSheet({
      onConfirmUpdate: updateRoutineSetValue,
    });

  const {
    openRoutineExerciseAddBottomSheet,
    bottomSheetProps: routineExerciseAddBottomSheetProps,
  } = useRoutineExerciseAddBottomSheet({
    onConfirmAdd: addExercisesToRoutine,
  });

  const renderRoutineExercise = useCallback(
    ({ item }: { item: RoutineExercise }) => {
      const routineExerciseId = String(item.id);
      const isCurrentExercise = activeSet?.routineExerciseId === routineExerciseId;

      return (
        <ERSwipeableAccordion
          key={routineExerciseId}
          onDeletePress={undefined}
          visible={
            <ERImageTitleSubtitle
              variant="lg"
              title={item.exercise.name}
              subtitle={`${item.sets.length}세트`}
              imageSrc={item.exercise.image ?? 'https://via.placeholder.com/150'}
            />
          }
          hidden={
            <View>
              <ERTable>
                <ERTable.Header>
                  <ERTable.Cell width={50}>
                    <ERTable.Text text="세트" />
                  </ERTable.Cell>
                  <ERTable.Cell>
                    <ERTable.Text text="KG" />
                  </ERTable.Cell>
                  <ERTable.Cell>
                    <ERTable.Text text="횟수" />
                  </ERTable.Cell>
                  <ERTable.Cell>
                    <ERTable.Text text="시간" />
                  </ERTable.Cell>
                  <ERTable.Cell>
                    <ERTable.Text text="휴식" />
                  </ERTable.Cell>
                </ERTable.Header>

                <ERTable.Body>
                  {item.sets.map((set: Set) => {
                    const setId = String(set.id);

                    const active =
                      activeSet?.routineExerciseId === routineExerciseId &&
                      activeSet?.setId === setId;

                    const done = isDoneSet(doneMap, routineExerciseId, setId);
                    const variant = active ? 'active' : done ? 'done' : 'default';

                    const canEdit = !done;

                    return (
                      <ERTable.Row key={setId} variant={variant}>
                        <ERTable.Cell width={50}>
                          <ERTable.Text text={String(set.order)} />
                        </ERTable.Cell>

                        <ERTable.Cell>
                          {canEdit ? (
                            <ERTable.Input
                              value={getCellValue(set, 'weight')}
                              isActive={
                                activeCell?.routineExerciseId === routineExerciseId &&
                                activeCell?.setId === setId &&
                                activeCell?.metric === 'weight'
                              }
                              onPress={() =>
                                openSetUpdateBottomSheet({
                                  routineExerciseId,
                                  setId,
                                  metric: 'weight',
                                  value: getCellValue(set, 'weight'),
                                })
                              }
                            />
                          ) : (
                            <ERTable.Text text={String(set.weight ?? '-')} />
                          )}
                        </ERTable.Cell>

                        <ERTable.Cell>
                          {canEdit ? (
                            <ERTable.Input
                              value={getCellValue(set, 'rep')}
                              isActive={
                                activeCell?.routineExerciseId === routineExerciseId &&
                                activeCell?.setId === setId &&
                                activeCell?.metric === 'rep'
                              }
                              onPress={() =>
                                openSetUpdateBottomSheet({
                                  routineExerciseId,
                                  setId,
                                  metric: 'rep',
                                  value: getCellValue(set, 'rep'),
                                })
                              }
                            />
                          ) : (
                            <ERTable.Text text={String(set.rep ?? '-')} />
                          )}
                        </ERTable.Cell>

                        <ERTable.Cell>
                          {canEdit ? (
                            <ERTable.Input
                              value={getCellValue(set, 'exerciseSec')}
                              isActive={
                                activeCell?.routineExerciseId === routineExerciseId &&
                                activeCell?.setId === setId &&
                                activeCell?.metric === 'exerciseSec'
                              }
                              onPress={() =>
                                openSetUpdateBottomSheet({
                                  routineExerciseId,
                                  setId,
                                  metric: 'exerciseSec',
                                  value: getCellValue(set, 'exerciseSec'),
                                })
                              }
                            />
                          ) : (
                            <ERTable.Text text={formatDuration(set.exerciseSec)} />
                          )}
                        </ERTable.Cell>

                        <ERTable.Cell>
                          {canEdit ? (
                            <ERTable.Input
                              value={getCellValue(set, 'restSec')}
                              isActive={
                                activeCell?.routineExerciseId === routineExerciseId &&
                                activeCell?.setId === setId &&
                                activeCell?.metric === 'restSec'
                              }
                              onPress={() =>
                                openSetUpdateBottomSheet({
                                  routineExerciseId,
                                  setId,
                                  metric: 'restSec',
                                  value: getCellValue(set, 'restSec'),
                                })
                              }
                            />
                          ) : (
                            <ERTable.Text text={formatDuration(set.restSec)} />
                          )}
                        </ERTable.Cell>
                      </ERTable.Row>
                    );
                  })}
                </ERTable.Body>
              </ERTable>

              <View style={styles.spacer16} />

              <HStack justify="space-between" align="center">
                <Pressable
                  onPress={() => deleteSet(routineExerciseId)}
                  style={({ pressed }) => [styles.subButton, pressed && { opacity: 0.85 }]}
                >
                  <Text style={[styles.subButtonText, { color: theme.colors.textMuted }]}>
                    - 세트 삭제
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() => addSet(routineExerciseId)}
                  style={({ pressed }) => [styles.subButton, pressed && { opacity: 0.85 }]}
                >
                  <Text style={[styles.subButtonText, { color: theme.colors.primary1 }]}>
                    + 세트 추가
                  </Text>
                </Pressable>
              </HStack>

              <View style={styles.spacer12} />

              <ERButton
                variant="solid"
                disabled={!isCurrentExercise || restRunning}
                onPress={completeSet}
              >
                세트 완료
              </ERButton>
            </View>
          }
        />
      );
    },
    [
      activeSet,
      doneMap,
      completeSet,
      theme,
      addSet,
      deleteSet,
      activeCell,
      getCellValue,
      openSetUpdateBottomSheet,
      restRunning,
      isDoneSet,
      formatDuration,
    ]
  );

  return (
    <PageLayout
      mode="stack"
      title="루틴 진행"
      overlay={({ scrollY }) => (
        <>
          <RoutineRestTimerModal
            open={restTimerOpen}
            remain={restRemain}
            onCloseTemp={closeRestTimerTemp}
            onSkip={skipRest}
            formatDuration={formatDuration}
          />

          <ERFloatingActionButton
            scrollY={scrollY}
            onButtonClick={openRoutineExerciseAddBottomSheet}
          />

          <RoutineExerciseAddBottomSheet
            {...routineExerciseAddBottomSheetProps}
            exerciseList={exerciseList}
          />

          <SetUpdateBottomSheet {...setUpdateBottomSheetProps} />

          <RoutineFinishConfirmModal
            open={routineFinishConfirmOpen}
            onOpenChange={setRoutineFinishConfirmOpen}
            onConfirm={confirmRoutineFinish}
            accentColor={theme.colors.primary1}
          />

          <RoutineFinishWarningModal
            open={routineFinishWarningOpen}
            onOpenChange={setRoutineFinishWarningOpen}
            onConfirm={confirmRoutineFinish}
            accentColor={theme.colors.red1}
          />
        </>
      )}
      main={
        <VStack style={styles.flex1}>
          <FlatList
            data={routine.routineExercises}
            extraData={{ activeSet, doneMap, restRunning }}
            keyExtractor={item => String(item.id)}
            renderItem={renderRoutineExercise}
            ItemSeparatorComponent={() => <View style={styles.spacer10} />}
            showsVerticalScrollIndicator={false}
          />
        </VStack>
      }
      footer={
        <HStack gap={12}>
          <Pressable
            onPress={() => {
              if (!restRunning) {
                return;
              }
              setRestTimerOpen(true);
            }}
            style={({ pressed }) => [
              styles.timerBox,
              { backgroundColor: theme.colors.white1 },
              pressed && restRunning && { opacity: 0.85 },
              !restRunning && { opacity: 0.4 },
            ]}
          >
            <Text style={[styles.timerBoxText, { color: bottomTimerTextColor }]}>
              {restRunning ? formatDuration(restRemain) : '00:00'}
            </Text>
          </Pressable>

          <View style={styles.flex1}>
            <ERButton
              variant="solid"
              onPress={() => {
                if (isAllDone) {
                  setRoutineFinishConfirmOpen(true);
                } else {
                  setRoutineFinishWarningOpen(true);
                }
              }}
              containerStyle={styles.width100}
            >
              루틴 완료 ({doneSetCount}/{totalSetCount})
            </ERButton>
          </View>
        </HStack>
      }
    />
  );
};

export default RoutineProgressScreen;

const styles = StyleSheet.create({
  flex1: {
    flex: 1,
  },
  width100: {
    width: '100%',
  },
  spacer10: {
    height: 10,
  },
  spacer12: {
    height: 12,
  },
  spacer16: {
    height: 16,
  },
  timerBox: {
    width: 120,
    height: 52,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },

  timerBoxText: {
    fontSize: 20,
    fontWeight: '900',
  },

  subButton: {
    flex: 1,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 6,
  },

  subButtonText: {
    fontSize: 14,
    fontWeight: '700',
  },
});
