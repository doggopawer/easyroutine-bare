import React, { useCallback, useMemo, useRef, useState } from 'react';
import { StyleSheet, FlatList, View, ScrollView } from 'react-native';
import PageLayout from '@/components/PageLayout/PageLayout';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RoutineStackParamList } from '@/navigation/types';
import ERConfirmModal from '@/components/ERConfirmModal/ERConfirmModal';
import ERFloatingActionButton from '@/components/ERFloatingActionButton/ERFloatingActionButton';
import { useTheme } from '@/theme/ThemeProvider/ThemeProvider';
import ERSwipeableAccordion from '@/components/ERSwipeableAccordion/ERSwipeableAccordion';
import ERImageTitleSubtitle from '@/components/ERImageTitleSubTitle/ERImageTitleSubTitle';
import ERTable from '@/components/ERTable/ERTable';

import ERBottomSheet, { ERBottomSheetRef } from '@/components/ERBottomSheet/ERBottomSheet';
import ERIntegerKeypad from '@/components/ERKeyPad/ERIntegerKeypad';
import ERDecimalKeypad from '@/components/ERKeyPad/ERDecimalKeypad';
import ERDurationKeypad from '@/components/ERKeyPad/ERDurationKeypad';
import { Routine, RoutineExercise, Set } from '@/types/model';
import { VStack } from '@/components/VStack/VStack';
import ERInput from '@/components/ERInput/ERInput';
import ERTab from '@/components/ERTab/ERTab';
import { Category } from '@/types/common';
import ERCheckbox from '@/components/ERCheckbox/ERCheckbox';
import { useExerciseListQuery } from '@/hooks/useExerciseListQuery';
import ERButton from '@/components/ERButton/ERButton';
import Toast from 'react-native-toast-message';
import { useRoutineUpdateMutation } from '@/hooks/useRoutineUpdateMutation';

/* -------------------------------------------------------------------------- */
/*                                ✅ 타입 정의                                  */
/* -------------------------------------------------------------------------- */

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

type Props = NativeStackScreenProps<RoutineStackParamList, 'RoutineEdit'>;

const RoutineEditScreen: React.FC<Props> = ({ navigation, route }) => {
  const { res } = useExerciseListQuery({});
  const { theme } = useTheme();

  const { routineId, routine: initialRoutine } = route.params; // ✅ params에서 가져오기

  const [routine, setRoutine] = useState<Routine>(initialRoutine);

  const { mutateAsync: updateRoutineMutate } = useRoutineUpdateMutation();

  const exerciseList = res?.body ?? [];

  /* -------------------------------------------------------------------------- */
  /*                                ✅ 삭제 모달 상태                             */
  /* -------------------------------------------------------------------------- */

  const [exerciseDeleteModalOpen, setExerciseDeleteModalOpen] = useState<boolean>(false);
  const [deleteTargetExerciseId, setDeleteTargetExerciseId] = useState<string | null>(null);

  /* -------------------------------------------------------------------------- */
  /*                                ✅ 라이브러리 검색/카테고리                     */
  /* -------------------------------------------------------------------------- */

  const [category, setCategory] = useState<Category>(Category.ALL);
  const [search, setSearch] = useState<string>('');

  /* -------------------------------------------------------------------------- */
  /*                                ✅ 선택된 운동 ID 목록 (체크박스)               */
  /* -------------------------------------------------------------------------- */

  const [selectedExerciseIds, setSelectedExerciseIds] = useState<string[]>([]);

  /* -------------------------------------------------------------------------- */
  /*                                ✅ Keypad BottomSheet                         */
  /* -------------------------------------------------------------------------- */

  const keypadRef = useRef<ERBottomSheetRef>(null);
  const libraryRef = useRef<ERBottomSheetRef>(null);
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

  const openLibrary = useCallback(() => {
    libraryRef.current?.open();
  }, []);

  const closeLibrary = useCallback(() => {
    libraryRef.current?.close();
  }, []);

  /* -------------------------------------------------------------------------- */
  /*                                ✅ Routine 전체 상태                           */
  /* -------------------------------------------------------------------------- */

  // const [routine, setRoutine] = useState<Routine>({
  //   id: routineId,
  //   order: 1,
  //   name: '상체 루틴',
  //   color: '#855CF8',
  //   routineExercises: [
  //     {
  //       id: 'routine-ex-1',
  //       order: 1,
  //       exercise: {
  //         id: 'exercise-1',
  //         name: '벤치프레스',
  //         image: 'https://via.placeholder.com/150',
  //         category: 'CHEST',
  //         types: ['WEIGHT', 'COUNT', 'REST'],
  //         isEditable: 0,
  //         shareLevel: 1,
  //       },
  //       sets: [
  //         { id: 'set-1', order: 1, weight: 10, rep: 10, exerciseSec: 300, restSec: 60 },
  //         { id: 'set-2', order: 2, weight: 12.5, rep: 8, exerciseSec: 270, restSec: 90 },
  //         { id: 'set-3', order: 3, weight: 15, rep: 6, exerciseSec: 180, restSec: 60 },
  //       ],
  //     },
  //   ],
  // });

  const routineExercises = routine.routineExercises;

  /* -------------------------------------------------------------------------- */
  /*                                ✅ value 표시 helper                          */
  /* -------------------------------------------------------------------------- */

  const formatDuration = useCallback((sec?: number) => {
    const s = sec ?? 0;
    const mm = String(Math.floor(s / 60)).padStart(2, '0');
    const ss = String(s % 60).padStart(2, '0');
    return `${mm}:${ss}`;
  }, []);

  const parseDurationToSec = useCallback((value: string) => {
    const [mmRaw, ssRaw] = value.split(':');

    const mm = Number(mmRaw);
    const ss = Number(ssRaw);

    if (Number.isNaN(mm) || Number.isNaN(ss)) return 0;
    return mm * 60 + ss;
  }, []);

  const getCellValue = useCallback(
    (set: Set, metric: MetricType) => {
      if (metric === 'weight') return String(set.weight ?? '');
      if (metric === 'rep') return String(set.rep ?? '');
      if (metric === 'exerciseSec') return formatDuration(set.exerciseSec);
      return formatDuration(set.restSec);
    },
    [formatDuration]
  );

  /* -------------------------------------------------------------------------- */
  /*                                ✅ confirm 시 routine 상태 반영                 */
  /* -------------------------------------------------------------------------- */

  const handleKeyPadConfirm = useCallback(
    (next: string) => {
      if (!activeCell) return;

      setRoutine((prev: Routine) => {
        const nextRoutineExercises: RoutineExercise[] = prev.routineExercises.map(
          (re: RoutineExercise) => {
            if (String(re.id) !== activeCell.routineExerciseId) return re;

            const nextSets: Set[] = re.sets.map((s: Set) => {
              if (String(s.id) !== activeCell.setId) return s;

              if (activeCell.metric === 'weight') return { ...s, weight: next };
              if (activeCell.metric === 'rep') return { ...s, rep: next };
              if (activeCell.metric === 'exerciseSec')
                return { ...s, exerciseSec: parseDurationToSec(next) };

              return { ...s, restSec: parseDurationToSec(next) };
            });

            return { ...re, sets: nextSets };
          }
        );

        return {
          ...prev,
          routineExercises: nextRoutineExercises,
        };
      });

      closeKeypad();
    },
    [activeCell, closeKeypad, parseDurationToSec]
  );

  const handleExerciseDeleteConfirm = useCallback(() => {
    if (!deleteTargetExerciseId) return;

    setRoutine(prev => ({
      ...prev,
      routineExercises: prev.routineExercises.filter(
        re => String(re.id) !== deleteTargetExerciseId
      ),
    }));

    setDeleteTargetExerciseId(null);
  }, [deleteTargetExerciseId]);

  /* -------------------------------------------------------------------------- */
  /*                                ✅ 운동 추가하기 버튼 handler                   */
  /* -------------------------------------------------------------------------- */

  const handleAddExercisesToRoutine = useCallback(() => {
    if (selectedExerciseIds.length === 0) return;

    const selectedExercises = exerciseList.filter(ex =>
      selectedExerciseIds.includes(String(ex.id))
    );

    setRoutine(prev => {
      const nextOrderStart = prev.routineExercises.length + 1;

      const nextRoutineExercises: RoutineExercise[] = selectedExercises.map((exercise, idx) => ({
        id: `routine-ex-${Date.now()}-${idx}`,
        order: nextOrderStart + idx,
        exercise,
        sets: [
          {
            id: `set-${Date.now()}-${idx}-1`,
            order: 1,
            weight: 0,
            rep: 0,
            exerciseSec: 0,
            restSec: 60,
          },
        ],
      }));

      return {
        ...prev,
        routineExercises: [...prev.routineExercises, ...nextRoutineExercises],
      };
    });

    setSelectedExerciseIds([]);
    closeLibrary();
  }, [selectedExerciseIds, exerciseList, closeLibrary]);

  const handleCreateRoutine = useCallback(async () => {
    try {
      await updateRoutineMutate(routine);

      // ✅✅✅ 성공 토스트
      Toast.show({
        type: 'success',
        text1: '저장 완료',
        text2: '루틴이 저장되었습니다.',
      });

      // ✅✅✅ 저장 후 뒤로가기
      navigation.goBack();
    } catch (e) {
      // ✅✅✅ 실패 토스트
      Toast.show({
        type: 'error',
        text1: '저장 실패',
        text2: '잠시 후 다시 시도해주세요.',
      });

      console.log(e);
    }
  }, [updateRoutineMutate, routine, navigation]);

  return (
    <PageLayout
      mode="stack"
      title={routine.name}
      scrollable={false}
      overlay={({ scrollY }) => (
        <>
          <ERConfirmModal
            open={exerciseDeleteModalOpen}
            onOpenChange={(next: boolean) => {
              setExerciseDeleteModalOpen(next);
              if (!next) setDeleteTargetExerciseId(null);
            }}
            title="운동 삭제"
            description="운동을 삭제하시겠습니까?"
            cancelText="취소"
            confirmText="삭제"
            onConfirm={handleExerciseDeleteConfirm}
            accentColor={theme.colors.red1}
          />

          <ERFloatingActionButton scrollY={scrollY} onButtonClick={() => openLibrary()} />

          <ERBottomSheet ref={keypadRef} snapPoints={['45%']} onClose={closeKeypad}>
            {inputKind === 'integer' && (
              <ERIntegerKeypad
                defaultValue={activeCell?.value ?? ''}
                onCancel={closeKeypad}
                onConfirm={handleKeyPadConfirm}
              />
            )}

            {inputKind === 'decimal' && (
              <ERDecimalKeypad
                defaultValue={activeCell?.value ?? ''}
                onCancel={closeKeypad}
                onConfirm={handleKeyPadConfirm}
              />
            )}

            {inputKind === 'duration' && (
              <ERDurationKeypad
                defaultValue={activeCell?.value ?? ''}
                onCancel={closeKeypad}
                onConfirm={handleKeyPadConfirm}
              />
            )}
          </ERBottomSheet>

          {/* ------------------------------------------------------------------ */}
          {/* ✅ 운동 라이브러리 BottomSheet                                       */}
          {/* ------------------------------------------------------------------ */}

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
        </>
      )}
      main={
        <>
          <FlatList
            data={routineExercises}
            keyExtractor={item => item.id.toString()}
            renderItem={({ item: routineExercise }) => (
              <ERSwipeableAccordion
                key={routineExercise.id.toString()}
                onDeletePress={() => {
                  setExerciseDeleteModalOpen(true);
                  setDeleteTargetExerciseId(routineExercise.id.toString());
                }}
                visible={
                  <ERImageTitleSubtitle
                    variant="lg"
                    title={routineExercise.exercise.name}
                    subtitle={`${routineExercise.sets.length}세트`}
                    imageSrc={routineExercise.exercise.image ?? 'https://via.placeholder.com/150'}
                  />
                }
                hidden={
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
                      {routineExercise.sets.map((set: Set) => (
                        <ERTable.Row key={set.id.toString()}>
                          <ERTable.Cell width={50}>
                            <ERTable.Text text={String(set.order)} />
                          </ERTable.Cell>

                          <ERTable.Cell>
                            <ERTable.Input
                              value={getCellValue(set, 'weight')}
                              isActive={
                                activeCell?.routineExerciseId === routineExercise.id.toString() &&
                                activeCell?.setId === set.id.toString() &&
                                activeCell?.metric === 'weight'
                              }
                              onPress={() =>
                                openKeypad({
                                  routineExerciseId: routineExercise.id.toString(),
                                  setId: set.id.toString(),
                                  metric: 'weight',
                                  value: getCellValue(set, 'weight'),
                                })
                              }
                            />
                          </ERTable.Cell>

                          <ERTable.Cell>
                            <ERTable.Input
                              value={getCellValue(set, 'rep')}
                              isActive={
                                activeCell?.routineExerciseId === routineExercise.id.toString() &&
                                activeCell?.setId === set.id.toString() &&
                                activeCell?.metric === 'rep'
                              }
                              onPress={() =>
                                openKeypad({
                                  routineExerciseId: routineExercise.id.toString(),
                                  setId: set.id.toString(),
                                  metric: 'rep',
                                  value: getCellValue(set, 'rep'),
                                })
                              }
                            />
                          </ERTable.Cell>

                          <ERTable.Cell>
                            <ERTable.Input
                              value={getCellValue(set, 'exerciseSec')}
                              isActive={
                                activeCell?.routineExerciseId === routineExercise.id.toString() &&
                                activeCell?.setId === set.id.toString() &&
                                activeCell?.metric === 'exerciseSec'
                              }
                              onPress={() =>
                                openKeypad({
                                  routineExerciseId: routineExercise.id.toString(),
                                  setId: set.id.toString(),
                                  metric: 'exerciseSec',
                                  value: getCellValue(set, 'exerciseSec'),
                                })
                              }
                            />
                          </ERTable.Cell>

                          <ERTable.Cell>
                            <ERTable.Input
                              value={getCellValue(set, 'restSec')}
                              isActive={
                                activeCell?.routineExerciseId === routineExercise.id.toString() &&
                                activeCell?.setId === set.id.toString() &&
                                activeCell?.metric === 'restSec'
                              }
                              onPress={() =>
                                openKeypad({
                                  routineExerciseId: routineExercise.id.toString(),
                                  setId: set.id.toString(),
                                  metric: 'restSec',
                                  value: getCellValue(set, 'restSec'),
                                })
                              }
                            />
                          </ERTable.Cell>
                        </ERTable.Row>
                      ))}
                    </ERTable.Body>
                  </ERTable>
                }
              />
            )}
            ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          />
          <ERButton variant="solid" onPress={handleCreateRoutine}>
            루틴 저장
          </ERButton>
        </>
      }
    />
  );
};

export default RoutineEditScreen;

const styles = StyleSheet.create({
  text: {
    fontSize: 20,
  },
});
