import React from 'react';
import { StyleSheet, FlatList, View } from 'react-native';
import PageLayout from '@/components/PageLayout/PageLayout';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RoutineStackParamList } from '@/navigation/types';
import ERConfirmModal from '@/components/ERConfirmModal/ERConfirmModal';
import ERFloatingActionButton from '@/components/ERFloatingActionButton/ERFloatingActionButton';
import { useTheme } from '@/theme/ThemeProvider/ThemeProvider';
import ERSwipeableAccordion from '@/components/ERSwipeableAccordion/ERSwipeableAccordion';
import ERImageTitleSubtitle from '@/components/ERImageTitleSubTitle/ERImageTitleSubTitle';
import ERTable from '@/components/ERTable/ERTable';

import ERBottomSheet from '@/components/ERBottomSheet/ERBottomSheet';
import ERIntegerKeypad from '@/components/ERKeyPad/ERIntegerKeypad';
import ERDecimalKeypad from '@/components/ERKeyPad/ERDecimalKeypad';
import ERDurationKeypad from '@/components/ERKeyPad/ERDurationKeypad';
import { Set } from '@/types/model';
import ERInput from '@/components/ERInput/ERInput';
import ERTab from '@/components/ERTab/ERTab';
import { Category } from '@/types/common';
import ERCheckbox from '@/components/ERCheckbox/ERCheckbox';
import ERButton from '@/components/ERButton/ERButton';
import { useRoutineCreateScreen } from '@/hooks/useRoutineCreateScreen';

type Props = NativeStackScreenProps<RoutineStackParamList, 'RoutineCreate'>;

const RoutineCreateScreen: React.FC<Props> = ({ navigation }) => {
  const { theme } = useTheme();

  const {
    // State
    exerciseList,
    exerciseDeleteModalOpen,
    setExerciseDeleteModalOpen,
    setDeleteTargetExerciseId,
    category,
    setCategory,
    search,
    setSearch,
    selectedExerciseIds,
    setSelectedExerciseIds,
    activeCell,
    routineExercises,

    // Refs
    keypadRef,
    libraryRef,

    // Computed
    inputKind,

    // Handlers
    openKeypad,
    closeKeypad,
    openLibrary,
    closeLibrary,
    getCellValue,
    handleKeyPadConfirm,
    handleExerciseDeleteConfirm,
    handleAddExercisesToRoutine,
    handleCreateRoutine,
  } = useRoutineCreateScreen(navigation);

  return (
    <PageLayout
      mode="stack"
      title="루틴 생성"
      scrollable={false}
      overlay={({ scrollY }) => (
        <>
          <ERConfirmModal
            open={exerciseDeleteModalOpen}
            onOpenChange={(next: boolean) => {
              setExerciseDeleteModalOpen(next);
              if (!next) {
                setDeleteTargetExerciseId(null);
              }
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
            ItemSeparatorComponent={() => <View style={styles.spacer10} />}
          />

          <ERButton variant="solid" onPress={handleCreateRoutine}>
            루틴 생성
          </ERButton>
        </>
      }
    />
  );
};

export default RoutineCreateScreen;

const styles = StyleSheet.create({
  paddingVertical16: {
    paddingVertical: 16,
  },
  searchInputContainer: {
    borderRadius: 999,
  },
  fontWeight700: {
    fontWeight: '700',
  },
  spacer16: {
    height: 16,
  },
  spacer10: {
    height: 10,
  },
  exerciseListContainer: {
    height: 300,
  },
  padding16: {
    padding: 16,
  },
});
