import React, { useCallback } from 'react';
import { FlatList, View, Pressable, Text, StyleSheet, Modal } from 'react-native';
import PageLayout from '@/components/ui/PageLayout/PageLayout';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RoutineStackParamList } from '@/navigation/types';
import { RoutineExercise, Set } from '@/types/model';
import { VStack } from '@/components/ui/VStack/VStack';
import { HStack } from '@/components/ui/HStack/HStack';
import { useTheme } from '@/theme/ThemeProvider/ThemeProvider';
import ERSwipeableAccordion from '@/components/ui/ERSwipeableAccordion/ERSwipeableAccordion';
import ERImageTitleSubtitle from '@/components/ui/ERImageTitleSubTitle/ERImageTitleSubTitle';
import ERTable from '@/components/ui/ERTable/ERTable';
import ERConfirmModal from '@/components/ui/ERConfirmModal/ERConfirmModal';
import ERFloatingActionButton from '@/components/ui/ERFloatingActionButton/ERFloatingActionButton';

import ERBottomSheet from '@/components/ui/ERBottomSheet/ERBottomSheet';
import ERInput from '@/components/ui/ERInput/ERInput';
import ERTab from '@/components/ui/ERTab/ERTab';
import ERCheckbox from '@/components/ui/ERCheckbox/ERCheckbox';
import ERButton from '@/components/ui/ERButton/ERButton';
import { Category } from '@/types/common';

import ERIntegerKeypad from '@/components/ui/ERKeyPad/ERIntegerKeypad';
import ERDecimalKeypad from '@/components/ui/ERKeyPad/ERDecimalKeypad';
import ERDurationKeypad from '@/components/ui/ERKeyPad/ERDurationKeypad';
import { useRoutineProgressScreen } from '@/hooks/useRoutineProgressScreen';

/* -------------------------------------------------------------------------- */
/* ✅ 타입 정의                                                                */
/* -------------------------------------------------------------------------- */

type Props = NativeStackScreenProps<RoutineStackParamList, 'RoutineProgress'>;

/* -------------------------------------------------------------------------- */
/* ✅ Rest Timer Modal                                                        */
/* -------------------------------------------------------------------------- */

type RestTimerModalProps = {
  open: boolean;
  remain: number;
  onCloseTemp: () => void;
  onSkip: () => void;
  onFinish: () => void;
  formatDuration: (sec?: number) => string;
};

const RestTimerModal: React.FC<RestTimerModalProps> = ({
  open,
  remain,
  onCloseTemp,
  onSkip,
  onFinish,
  formatDuration,
}) => {
  const { theme } = useTheme();

  const timerColor = remain <= 10 ? theme.colors.red1 : theme.colors.primary1;

  return (
    <Modal visible={open} transparent animationType="fade">
      <View style={styles.modalBackdrop}>
        <View style={[styles.modalCard, { backgroundColor: theme.colors.white1 }]}>
          <Text style={[styles.modalTitle, { color: theme.colors.text }]}>휴식</Text>

          <Text style={[styles.timerText, { color: timerColor }]}>{formatDuration(remain)}</Text>

          <View style={styles.spacer16} />

          <Pressable
            onPress={onCloseTemp}
            style={({ pressed }) => [
              styles.modalButton,
              { backgroundColor: theme.colors.gray6 },
              pressed && { opacity: 0.85 },
            ]}
          >
            <Text style={[styles.modalButtonText, { color: theme.colors.text }]}>잠시 닫기</Text>
          </Pressable>

          <View style={styles.spacer10} />

          <Pressable
            onPress={onSkip}
            style={({ pressed }) => [
              styles.modalButton,
              { backgroundColor: theme.colors.primary1 },
              pressed && { opacity: 0.85 },
            ]}
          >
            <Text style={[styles.modalButtonText, { color: theme.colors.white1 }]}>스킵</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const RoutineProgressScreen: React.FC<Props> = ({ navigation, route }) => {
  const { theme } = useTheme();
  const { routine: initialRoutine } = route.params;

  const {
    // State
    routine,
    setRoutine,
    category,
    setCategory,
    search,
    setSearch,
    selectedExerciseIds,
    setSelectedExerciseIds,
    activeCell,
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

    // Refs
    libraryRef,
    keypadRef,

    // Computed
    inputKind,
    totalSetCount,
    doneSetCount,
    isAllDone,
    bottomTimerTextColor,

    // Helpers
    isDoneSet,
    getCellValue,
    formatDuration,
    parseDurationToSec,

    // Handlers
    openLibrary,
    closeLibrary,
    openKeypad,
    closeKeypad,
    handleRestTempClose,
    handleRestSkip,
    handleRestFinish,
    handleSetDone,
    handleAddSet,
    handleDeleteSet,
    handleAddExercisesToRoutine,
    handleConfirmRoutineFinish,
  } = useRoutineProgressScreen(initialRoutine, navigation);

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
                                openKeypad({
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
                                openKeypad({
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
                                openKeypad({
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
                                openKeypad({
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
                  onPress={() => handleDeleteSet(routineExerciseId)}
                  style={({ pressed }) => [styles.subButton, pressed && { opacity: 0.85 }]}
                >
                  <Text style={[styles.subButtonText, { color: theme.colors.textMuted }]}>
                    - 세트 삭제
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() => handleAddSet(routineExerciseId)}
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
                onPress={handleSetDone}
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
      handleSetDone,
      theme,
      handleAddSet,
      handleDeleteSet,
      activeCell,
      getCellValue,
      openKeypad,
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
          <ERFloatingActionButton scrollY={scrollY} onButtonClick={openLibrary} />

          <RestTimerModal
            open={restTimerOpen}
            remain={restRemain}
            onCloseTemp={handleRestTempClose}
            onSkip={handleRestSkip}
            onFinish={handleRestFinish}
            formatDuration={formatDuration}
          />

          <ERBottomSheet ref={libraryRef} onClose={closeLibrary}>
            <View style={styles.paddingVertical16}>
              <ERInput
                value={search}
                onChangeText={setSearch}
                placeholder="검색"
                containerStyle={styles.searchInputContainer}
                inputStyle={styles.fontWeight700}
              />

              <View style={styles.spacer16} />

              <ERTab
                variant="chip"
                defaultValue={Category.ALL}
                value={category}
                onChange={(v: string) => setCategory(v as Category)}
              >
                <ERTab.Item value={Category.ALL}>전체</ERTab.Item>
                <ERTab.Item value={Category.CHEST}>가슴</ERTab.Item>
                <ERTab.Item value={Category.BACK}>등</ERTab.Item>
                <ERTab.Item value={Category.SHOULDER}>어깨</ERTab.Item>
                <ERTab.Item value={Category.LEG}>하체</ERTab.Item>
                <ERTab.Item value={Category.ARM}>팔</ERTab.Item>
                <ERTab.Item value={Category.ETC}>기타</ERTab.Item>
              </ERTab>
            </View>

            {/* ✅ 스크롤 리스트 영역 */}
            <View style={styles.exerciseListContainer}>
              <ERCheckbox
                variant="image-text"
                defaultValue={[]}
                value={selectedExerciseIds}
                onChange={setSelectedExerciseIds}
              >
                <FlatList
                  data={exerciseList}
                  keyExtractor={item => String(item.id)}
                  showsVerticalScrollIndicator={false}
                  renderItem={({ item }) => (
                    <ERCheckbox.Item
                      value={String(item.id)}
                      title={item.name}
                      imageSrc={item.image ?? undefined}
                    />
                  )}
                />
              </ERCheckbox>
            </View>

            {/* ✅ 버튼 영역 */}
            <View style={styles.padding16}>
              <ERButton variant="solid" onPress={handleAddExercisesToRoutine}>
                운동 추가
              </ERButton>
            </View>
          </ERBottomSheet>
          <ERBottomSheet ref={keypadRef} snapPoints={['45%']} onClose={closeKeypad}>
            {inputKind === 'integer' && (
              <ERIntegerKeypad
                defaultValue={activeCell?.value ?? ''}
                onCancel={closeKeypad}
                onConfirm={next => {
                  if (!activeCell) {
                    return;
                  }

                  setRoutine(prev => {
                    const nextRoutineExercises = prev.routineExercises.map(re => {
                      if (String(re.id) !== activeCell.routineExerciseId) {
                        return re;
                      }

                      const nextSets = re.sets.map(s => {
                        if (String(s.id) !== activeCell.setId) {
                          return s;
                        }

                        if (activeCell.metric === 'weight') {
                          return { ...s, weight: next };
                        }
                        if (activeCell.metric === 'rep') {
                          return { ...s, rep: next };
                        }
                        if (activeCell.metric === 'exerciseSec') {
                          return { ...s, exerciseSec: parseDurationToSec(next) };
                        }

                        return { ...s, restSec: parseDurationToSec(next) };
                      });

                      return { ...re, sets: nextSets };
                    });

                    return { ...prev, routineExercises: nextRoutineExercises };
                  });

                  closeKeypad();
                }}
              />
            )}

            {inputKind === 'decimal' && (
              <ERDecimalKeypad
                defaultValue={activeCell?.value ?? ''}
                onCancel={closeKeypad}
                onConfirm={next => {
                  if (!activeCell) {
                    return;
                  }

                  setRoutine(prev => {
                    const nextRoutineExercises = prev.routineExercises.map(re => {
                      if (String(re.id) !== activeCell.routineExerciseId) {
                        return re;
                      }

                      const nextSets = re.sets.map(s => {
                        if (String(s.id) !== activeCell.setId) {
                          return s;
                        }

                        if (activeCell.metric === 'weight') {
                          return { ...s, weight: next };
                        }
                        if (activeCell.metric === 'rep') {
                          return { ...s, rep: next };
                        }
                        if (activeCell.metric === 'exerciseSec') {
                          return { ...s, exerciseSec: parseDurationToSec(next) };
                        }

                        return { ...s, restSec: parseDurationToSec(next) };
                      });

                      return { ...re, sets: nextSets };
                    });

                    return { ...prev, routineExercises: nextRoutineExercises };
                  });

                  closeKeypad();
                }}
              />
            )}

            {inputKind === 'duration' && (
              <ERDurationKeypad
                defaultValue={activeCell?.value ?? ''}
                onCancel={closeKeypad}
                onConfirm={next => {
                  if (!activeCell) {
                    return;
                  }

                  setRoutine(prev => {
                    const nextRoutineExercises = prev.routineExercises.map(re => {
                      if (String(re.id) !== activeCell.routineExerciseId) {
                        return re;
                      }

                      const nextSets = re.sets.map(s => {
                        if (String(s.id) !== activeCell.setId) {
                          return s;
                        }

                        if (activeCell.metric === 'exerciseSec') {
                          return { ...s, exerciseSec: parseDurationToSec(next) };
                        }

                        return { ...s, restSec: parseDurationToSec(next) };
                      });

                      return { ...re, sets: nextSets };
                    });

                    return { ...prev, routineExercises: nextRoutineExercises };
                  });

                  closeKeypad();
                }}
              />
            )}
          </ERBottomSheet>

          <ERConfirmModal
            open={routineFinishConfirmOpen}
            onOpenChange={setRoutineFinishConfirmOpen}
            title="루틴 완료"
            description="모든 세트를 완료했습니다. 루틴을 저장하시겠습니까?"
            cancelText="취소"
            confirmText="저장"
            onConfirm={handleConfirmRoutineFinish}
            accentColor={theme.colors.primary1}
          />

          <ERConfirmModal
            open={routineFinishWarningOpen}
            onOpenChange={setRoutineFinishWarningOpen}
            title="운동 미완료"
            description="아직 완료하지 않은 세트가 있습니다. 그래도 루틴을 종료하시겠습니까?"
            cancelText="취소"
            confirmText="종료"
            onConfirm={handleConfirmRoutineFinish}
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
  paddingVertical16: {
    paddingVertical: 16,
  },
  padding16: {
    padding: 16,
  },
  searchInputContainer: {
    borderRadius: 999,
  },
  fontWeight700: {
    fontWeight: '700',
  },
  exerciseListContainer: {
    height: 300,
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

  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },

  modalCard: {
    width: '100%',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
  },

  timerText: {
    marginTop: 16,
    fontSize: 42,
    fontWeight: '900',
  },

  modalButton: {
    width: '100%',
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalButtonText: {
    fontSize: 15,
    fontWeight: '700',
  },
});
