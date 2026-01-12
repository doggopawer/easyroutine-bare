import React, { useCallback, useMemo, useRef, useState, useEffect } from 'react';
import { FlatList, View, Pressable, Text, StyleSheet, Modal } from 'react-native';
import PageLayout from '@/components/PageLayout/PageLayout';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RoutineStackParamList } from '@/navigation/types';
import { Routine, RoutineExercise, Set, RoutineHistory, Exercise } from '@/types/model';
import { VStack } from '@/components/VStack/VStack';
import { HStack } from '@/components/HStack/HStack';
import { useTheme } from '@/theme/ThemeProvider/ThemeProvider';
import ERSwipeableAccordion from '@/components/ERSwipeableAccordion/ERSwipeableAccordion';
import ERImageTitleSubtitle from '@/components/ERImageTitleSubTitle/ERImageTitleSubTitle';
import ERTable from '@/components/ERTable/ERTable';
import ERConfirmModal from '@/components/ERConfirmModal/ERConfirmModal';
import ERFloatingActionButton from '@/components/ERFloatingActionButton/ERFloatingActionButton';
import Toast from 'react-native-toast-message';
import { useRoutineHistoryCreateMutation } from '@/hooks/useRoutineHistoryCreateMutation';

import ERBottomSheet, { ERBottomSheetRef } from '@/components/ERBottomSheet/ERBottomSheet';
import { useExerciseListQuery } from '@/hooks/useExerciseListQuery';
import ERInput from '@/components/ERInput/ERInput';
import ERTab from '@/components/ERTab/ERTab';
import ERCheckbox from '@/components/ERCheckbox/ERCheckbox';
import ERButton from '@/components/ERButton/ERButton';
import { Category } from '@/types/common';

import ERIntegerKeypad from '@/components/ERKeyPad/ERIntegerKeypad';
import ERDecimalKeypad from '@/components/ERKeyPad/ERDecimalKeypad';
import ERDurationKeypad from '@/components/ERKeyPad/ERDurationKeypad';

/* -------------------------------------------------------------------------- */
/* ✅ 타입 정의                                                                */
/* -------------------------------------------------------------------------- */

type Props = NativeStackScreenProps<RoutineStackParamList, 'RoutineProgress'>;

type DoneMap = Record<string, Record<string, boolean>>;

const isDoneSet = (doneMap: DoneMap, routineExerciseId: string, setId: string) =>
  !!doneMap[routineExerciseId]?.[setId];

export type MetricType = 'weight' | 'rep' | 'exerciseSec' | 'restSec';
export type InputKind = 'decimal' | 'integer' | 'duration';

export const getInputKind = (type: MetricType): InputKind => {
  if (type === 'weight') return 'decimal';
  if (type === 'rep') return 'integer';
  return 'duration';
};

type ActiveCell = {
  routineExerciseId: string;
  setId: string;
  metric: MetricType;
  value: string;
};

/* -------------------------------------------------------------------------- */
/* ✅ helper: duration 표시                                                    */
/* -------------------------------------------------------------------------- */

const formatDuration = (sec?: number) => {
  const s = sec ?? 0;
  const mm = String(Math.floor(s / 60)).padStart(2, '0');
  const ss = String(s % 60).padStart(2, '0');
  return `${mm}:${ss}`;
};

const parseDurationToSec = (value: string) => {
  const [mmRaw, ssRaw] = value.split(':');
  const mm = Number(mmRaw);
  const ss = Number(ssRaw);
  if (Number.isNaN(mm) || Number.isNaN(ss)) return 0;
  return mm * 60 + ss;
};

/* -------------------------------------------------------------------------- */
/* ✅ helper: 세트 id 생성                                                     */
/* -------------------------------------------------------------------------- */

const createNewSet = (order: number): Set => ({
  id: `set-${Date.now()}-${Math.random()}`,
  order,
  weight: 0,
  rep: 0,
  exerciseSec: 0,
  restSec: 60,
});

/* -------------------------------------------------------------------------- */
/* ✅ Rest Timer Modal                                                        */
/* -------------------------------------------------------------------------- */

type RestTimerModalProps = {
  open: boolean;
  remain: number;
  onCloseTemp: () => void;
  onSkip: () => void;
  onFinish: () => void;
};

const RestTimerModal: React.FC<RestTimerModalProps> = ({
  open,
  remain,
  onCloseTemp,
  onSkip,
  onFinish,
}) => {
  const { theme } = useTheme();

  const timerColor = remain <= 10 ? theme.colors.red1 : theme.colors.primary1;

  useEffect(() => {
    if (!open) return;
    if (remain !== 0) return;

    const id = setTimeout(() => {
      onFinish();
    }, 250);

    return () => clearTimeout(id);
  }, [remain, open, onFinish]);

  return (
    <Modal visible={open} transparent animationType="fade">
      <View style={styles.modalBackdrop}>
        <View style={[styles.modalCard, { backgroundColor: theme.colors.white1 }]}>
          <Text style={[styles.modalTitle, { color: theme.colors.text }]}>휴식</Text>

          <Text style={[styles.timerText, { color: timerColor }]}>{formatDuration(remain)}</Text>

          <View style={{ height: 16 }} />

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

          <View style={{ height: 10 }} />

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

  const [routine, setRoutine] = useState<Routine>(initialRoutine);

  const { res } = useExerciseListQuery({});
  const exerciseList = res?.body ?? [];

  const [category, setCategory] = useState<Category>(Category.ALL);
  const [search, setSearch] = useState<string>('');
  const [selectedExerciseIds, setSelectedExerciseIds] = useState<string[]>([]);

  const libraryRef = useRef<ERBottomSheetRef>(null);

  const openLibrary = useCallback(() => {
    libraryRef.current?.open();
  }, []);

  const closeLibrary = useCallback(() => {
    libraryRef.current?.close();
  }, []);

  const keypadRef = useRef<ERBottomSheetRef>(null);
  const [activeCell, setActiveCell] = useState<ActiveCell | null>(null);

  const inputKind = useMemo<InputKind | null>(() => {
    if (!activeCell) return null;
    return getInputKind(activeCell.metric);
  }, [activeCell]);

  const openKeypad = useCallback((cell: ActiveCell) => {
    setActiveCell(cell);
    keypadRef.current?.open();
  }, []);

  const closeKeypad = useCallback(() => {
    keypadRef.current?.close();
    setActiveCell(null);
  }, []);

  const getCellValue = useCallback((set: Set, metric: MetricType) => {
    if (metric === 'weight') return String(set.weight ?? '');
    if (metric === 'rep') return String(set.rep ?? '');
    if (metric === 'exerciseSec') return formatDuration(set.exerciseSec);
    return formatDuration(set.restSec);
  }, []);

  const { mutateAsync: createRoutineHistoryMutate } = useRoutineHistoryCreateMutation();

  /* -------------------------------------------------------------------------- */
  /* ✅✅✅ active를 index가 아닌 id로 관리 (근본 해결)                           */
  /* -------------------------------------------------------------------------- */

  const [activeSet, setActiveSet] = useState<{
    routineExerciseId: string;
    setId: string;
  } | null>(() => {
    const firstExercise = initialRoutine.routineExercises[0];
    if (!firstExercise) return null;
    const firstSet = firstExercise.sets[0];
    if (!firstSet) return null;

    return {
      routineExerciseId: String(firstExercise.id),
      setId: String(firstSet.id),
    };
  });

  const [doneMap, setDoneMap] = useState<DoneMap>({});

  const [restTimerOpen, setRestTimerOpen] = useState<boolean>(false);
  const [restRemain, setRestRemain] = useState<number>(0);
  const [restRunning, setRestRunning] = useState<boolean>(false);

  useEffect(() => {
    if (!restRunning) return;

    const timer = setInterval(() => {
      setRestRemain(prev => {
        if (prev <= 1) return 0;
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [restRunning]);

  const [routineHistory, setRoutineHistory] = useState<RoutineHistory>(() => ({
    id: `history-${Date.now()}`,
    order: routine.order,
    name: routine.name,
    color: routine.color,
    workoutTime: 0,
    createdAt: new Date().toISOString(),
    routineExercises: [],
  }));

  const [routineFinishConfirmOpen, setRoutineFinishConfirmOpen] = useState<boolean>(false);
  const [routineFinishWarningOpen, setRoutineFinishWarningOpen] = useState<boolean>(false);

  const pushDoneSetToHistory = useCallback((routineExercise: RoutineExercise, set: Set) => {
    setRoutineHistory(prev => {
      const reId = String(routineExercise.id);
      const setId = String(set.id);

      const alreadySaved = prev.routineExercises.some(
        re => String(re.id) === reId && re.sets.some(s => String(s.id) === setId)
      );
      if (alreadySaved) return prev;

      const hasExercise = prev.routineExercises.some(re => String(re.id) === reId);

      if (hasExercise) {
        const nextRoutineExercises = prev.routineExercises.map(re => {
          if (String(re.id) !== reId) return re;
          return { ...re, sets: [...re.sets, set] };
        });

        return { ...prev, routineExercises: nextRoutineExercises };
      }

      return {
        ...prev,
        routineExercises: [...prev.routineExercises, { ...routineExercise, sets: [set] }],
      };
    });
  }, []);

  const totalSetCount = useMemo(
    () => routine.routineExercises.reduce((acc, re) => acc + re.sets.length, 0),
    [routine]
  );

  const doneSetCount = useMemo(() => {
    let count = 0;
    routine.routineExercises.forEach(re => {
      re.sets.forEach(s => {
        if (isDoneSet(doneMap, String(re.id), String(s.id))) count += 1;
      });
    });
    return count;
  }, [routine, doneMap]);

  const isAllDone = useMemo(
    () => totalSetCount > 0 && doneSetCount === totalSetCount,
    [totalSetCount, doneSetCount]
  );

  /* -------------------------------------------------------------------------- */
  /* ✅ 다음 active set으로 이동 (id 기반)                                       */
  /* -------------------------------------------------------------------------- */

  const moveNext = useCallback(() => {
    if (!activeSet) return;

    const reIndex = routine.routineExercises.findIndex(
      re => String(re.id) === activeSet.routineExerciseId
    );
    if (reIndex === -1) return;

    const currentExercise = routine.routineExercises[reIndex];
    const setIndex = currentExercise.sets.findIndex(s => String(s.id) === activeSet.setId);
    if (setIndex === -1) return;

    const nextSet = currentExercise.sets[setIndex + 1];
    if (nextSet) {
      setActiveSet({
        routineExerciseId: String(currentExercise.id),
        setId: String(nextSet.id),
      });
      return;
    }

    const nextExercise = routine.routineExercises[reIndex + 1];
    if (nextExercise?.sets[0]) {
      setActiveSet({
        routineExerciseId: String(nextExercise.id),
        setId: String(nextExercise.sets[0].id),
      });
      return;
    }

    setRoutineFinishConfirmOpen(true);
    setActiveSet(null);
  }, [activeSet, routine]);

  useEffect(() => {
    if (!restRunning) return;
    if (restRemain !== 0) return;

    setRestRunning(false);
    setRestTimerOpen(false);
    moveNext();
  }, [restRemain, restRunning, moveNext]);

  const handleRestTempClose = useCallback(() => {
    setRestTimerOpen(false);
  }, []);

  const handleRestSkip = useCallback(() => {
    setRestRunning(false);
    setRestTimerOpen(false);
    setRestRemain(0);
    moveNext();
  }, [moveNext]);

  const handleRestFinish = useCallback(() => {
    setRestRunning(false);
    setRestTimerOpen(false);
    setRestRemain(0);
    moveNext();
  }, [moveNext]);

  /* -------------------------------------------------------------------------- */
  /* ✅ 세트 완료                                                                */
  /* -------------------------------------------------------------------------- */

  const handleSetDone = useCallback(() => {
    if (!activeSet) return;

    const currentExercise = routine.routineExercises.find(
      re => String(re.id) === activeSet.routineExerciseId
    );
    if (!currentExercise) return;

    const currentSet = currentExercise.sets.find(s => String(s.id) === activeSet.setId);
    if (!currentSet) return;

    const reId = String(currentExercise.id);
    const setId = String(currentSet.id);

    setDoneMap(prev => ({
      ...prev,
      [reId]: { ...(prev[reId] ?? {}), [setId]: true },
    }));

    pushDoneSetToHistory(currentExercise, currentSet);

    setTimeout(() => {
      const isLastSetOfExercise =
        currentExercise.sets[currentExercise.sets.length - 1]?.id === currentSet.id;

      const isLastExercise =
        routine.routineExercises[routine.routineExercises.length - 1]?.id === currentExercise.id;

      const isLastSetOfRoutine = isLastSetOfExercise && isLastExercise;

      if (isLastSetOfRoutine) {
        setActiveSet(null);
        setRoutineFinishConfirmOpen(true);
        return;
      }

      setRestRemain(currentSet.restSec);
      setRestRunning(true);
      setRestTimerOpen(true);
    }, 0);
  }, [activeSet, routine, pushDoneSetToHistory]);

  /* -------------------------------------------------------------------------- */
  /* ✅ 세트 추가                                                                */
  /* -------------------------------------------------------------------------- */

  const handleAddSet = useCallback((routineExerciseId: string) => {
    let createdSetId = '';

    setRoutine(prev => {
      const nextRoutineExercises = prev.routineExercises.map(re => {
        if (String(re.id) !== routineExerciseId) return re;

        const nextOrder = re.sets.length + 1;
        const newSet = createNewSet(nextOrder);
        createdSetId = String(newSet.id);

        return { ...re, sets: [...re.sets, newSet] };
      });

      return { ...prev, routineExercises: nextRoutineExercises };
    });

    // ✅✅✅ 핵심: 루틴 진행중이면 activeSet을 건드리면 안됨
    // ✅✅✅ 루틴이 끝나서 activeSet이 null일 때만 새 세트로 active 지정
    setTimeout(() => {
      setActiveSet(prev => {
        if (prev !== null) return prev; // ✅ 진행중이면 유지
        return { routineExerciseId, setId: createdSetId }; // ✅ 끝난 상태면 복구
      });
    }, 0);
  }, []);

  /* -------------------------------------------------------------------------- */
  /* ✅ 세트 삭제 (doneMap / activeSet / history까지 안전하게)                   */
  /* -------------------------------------------------------------------------- */

  const handleDeleteSet = useCallback(
    (routineExerciseId: string) => {
      const targetExercise = routine.routineExercises.find(
        re => String(re.id) === routineExerciseId
      );
      if (!targetExercise) return;
      if (targetExercise.sets.length <= 1) return;

      const deletedSet = targetExercise.sets[targetExercise.sets.length - 1];
      const deletedSetId = String(deletedSet.id);
      const reId = String(targetExercise.id);

      setRoutine(prev => {
        const nextRoutineExercises = prev.routineExercises.map(re => {
          if (String(re.id) !== routineExerciseId) return re;
          if (re.sets.length <= 1) return re;

          const nextSets = re.sets.slice(0, -1);
          return { ...re, sets: nextSets.map((s, idx) => ({ ...s, order: idx + 1 })) };
        });

        return { ...prev, routineExercises: nextRoutineExercises };
      });

      // ✅ doneMap에서 삭제된 setId 제거
      setDoneMap(prev => {
        const next = { ...prev };
        const exerciseDoneMap = { ...(next[reId] ?? {}) };
        delete exerciseDoneMap[deletedSetId];
        next[reId] = exerciseDoneMap;
        return next;
      });

      // ✅ activeSet이 삭제된 세트였다면, 바로 이전 세트로 active 이동
      if (activeSet?.routineExerciseId === routineExerciseId && activeSet?.setId === deletedSetId) {
        const prevSet = targetExercise.sets[targetExercise.sets.length - 2];
        if (prevSet) {
          setActiveSet({
            routineExerciseId,
            setId: String(prevSet.id),
          });
        }
      }
    },
    [routine, activeSet]
  );

  const handleAddExercisesToRoutine = useCallback(() => {
    if (selectedExerciseIds.length === 0) return;

    const selectedExercises: Exercise[] = exerciseList.filter(ex =>
      selectedExerciseIds.includes(String(ex.id))
    );

    setRoutine(prev => {
      const nextOrderStart = prev.routineExercises.length + 1;

      const nextRoutineExercises: RoutineExercise[] = selectedExercises.map((exercise, idx) => ({
        id: `routine-ex-${Date.now()}-${idx}`,
        order: nextOrderStart + idx,
        exercise,
        sets: [createNewSet(1)],
      }));

      return { ...prev, routineExercises: [...prev.routineExercises, ...nextRoutineExercises] };
    });

    setSelectedExerciseIds([]);
    closeLibrary();
  }, [selectedExerciseIds, exerciseList, closeLibrary]);

  const handleConfirmRoutineFinish = useCallback(async () => {
    try {
      await createRoutineHistoryMutate(routineHistory);

      Toast.show({
        type: 'success',
        text1: '루틴 완료!',
        text2: '기록이 저장되었습니다.',
      });

      navigation.goBack();
    } catch (e) {
      Toast.show({
        type: 'error',
        text1: '저장 실패',
        text2: '잠시 후 다시 시도해주세요.',
      });

      console.log(e);
    }
  }, [createRoutineHistoryMutate, routineHistory, navigation]);

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

              <View style={{ height: 16 }} />

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

              <View style={{ height: 12 }} />

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
    ]
  );

  const bottomTimerTextColor = useMemo(() => {
    if (!restRunning) return theme.colors.text;
    return restRemain <= 10 ? theme.colors.red1 : theme.colors.text;
  }, [restRunning, restRemain, theme.colors.red1, theme.colors.text]);

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
          />

          <ERBottomSheet ref={libraryRef} onClose={closeLibrary}>
            <View style={{ paddingVertical: 16 }}>
              <ERInput
                value={search}
                onChangeText={setSearch}
                placeholder="검색"
                containerStyle={{ borderRadius: 999 }}
                inputStyle={{ fontWeight: '700' }}
              />

              <View style={{ height: 16 }} />

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
            <View style={{ height: 300 }}>
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
            <View style={{ padding: 16 }}>
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
                  if (!activeCell) return;

                  setRoutine(prev => {
                    const nextRoutineExercises = prev.routineExercises.map(re => {
                      if (String(re.id) !== activeCell.routineExerciseId) return re;

                      const nextSets = re.sets.map(s => {
                        if (String(s.id) !== activeCell.setId) return s;

                        if (activeCell.metric === 'weight') return { ...s, weight: next };
                        if (activeCell.metric === 'rep') return { ...s, rep: next };
                        if (activeCell.metric === 'exerciseSec')
                          return { ...s, exerciseSec: parseDurationToSec(next) };

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
                  if (!activeCell) return;

                  setRoutine(prev => {
                    const nextRoutineExercises = prev.routineExercises.map(re => {
                      if (String(re.id) !== activeCell.routineExerciseId) return re;

                      const nextSets = re.sets.map(s => {
                        if (String(s.id) !== activeCell.setId) return s;

                        if (activeCell.metric === 'weight') return { ...s, weight: next };
                        if (activeCell.metric === 'rep') return { ...s, rep: next };
                        if (activeCell.metric === 'exerciseSec')
                          return { ...s, exerciseSec: parseDurationToSec(next) };

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
                  if (!activeCell) return;

                  setRoutine(prev => {
                    const nextRoutineExercises = prev.routineExercises.map(re => {
                      if (String(re.id) !== activeCell.routineExerciseId) return re;

                      const nextSets = re.sets.map(s => {
                        if (String(s.id) !== activeCell.setId) return s;

                        if (activeCell.metric === 'exerciseSec')
                          return { ...s, exerciseSec: parseDurationToSec(next) };

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
        <VStack style={{ flex: 1 }}>
          <FlatList
            data={routine.routineExercises}
            extraData={{ activeSet, doneMap, restRunning }}
            keyExtractor={item => String(item.id)}
            renderItem={renderRoutineExercise}
            ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
            showsVerticalScrollIndicator={false}
          />
        </VStack>
      }
      footer={
        <HStack gap={12}>
          <Pressable
            onPress={() => {
              if (!restRunning) return;
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

          <View style={{ flex: 1 }}>
            <ERButton
              variant="solid"
              onPress={() => {
                if (isAllDone) setRoutineFinishConfirmOpen(true);
                else setRoutineFinishWarningOpen(true);
              }}
              containerStyle={{ width: '100%' }}
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
