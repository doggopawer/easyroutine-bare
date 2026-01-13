import React, { useCallback, useMemo, useRef, useState } from 'react';
import { View, StyleSheet, FlatList, Text } from 'react-native';
import PageLayout from '@/components/PageLayout/PageLayout';
import ERInput from '@/components/ERInput/ERInput';
import ERTab from '@/components/ERTab/ERTab';
import { Category } from '@/types/common';
import { useExerciseListQuery } from '@/hooks/useExerciseListQuery';
import { VStack } from '@/components/VStack/VStack';
import { useTheme } from '@/theme/ThemeProvider/ThemeProvider';

import ERBottomSheet, { ERBottomSheetRef } from '@/components/ERBottomSheet/ERBottomSheet';
import ERButton from '@/components/ERButton/ERButton';
import ERLabel from '@/components/ERLabel/ERLabel';
import ERImageUploader from '@/components/ERImageUploader/ERImageUploader';
import { HStack } from '@/components/HStack/HStack';
import ERCheckbox from '@/components/ERCheckbox/ERCheckbox';
import { useExerciseCreateMutation } from '@/hooks/useExerciseCreateMutation';
import { useExerciseUpdateMutation } from '@/hooks/useExerciseUpdateMutation';
import { Exercise } from '@/types/model';
import Toast from 'react-native-toast-message';
import ERFloatingActionButton from '@/components/ERFloatingActionButton/ERFloatingActionButton';

type ExerciseType = 'WEIGHT' | 'COUNT' | 'TIME';
type ExerciseForm = Omit<Exercise, 'id'>;

type SheetMode = 'create' | 'update' | null;

const LibraryScreen: React.FC = () => {
  const { theme } = useTheme();
  const { res } = useExerciseListQuery({});
  const exerciseList = res?.body ?? [];

  const { mutateAsync: createExercise } = useExerciseCreateMutation();
  const { mutateAsync: updateExercise } = useExerciseUpdateMutation();

  /* -------------------------------------------------------------------------- */
  /* ✅ Search / Filter / Selected                                              */
  /* -------------------------------------------------------------------------- */

  const [search, setSearch] = useState<string>('');
  const [category, setCategory] = useState<Category>(Category.ALL);
  const [selectedExerciseId, setSelectedExerciseId] = useState<string>('');

  const selectedExercise = useMemo<Exercise | undefined>(() => {
    if (!selectedExerciseId) {
      return undefined;
    }
    return exerciseList.find(e => String(e.id) === String(selectedExerciseId));
  }, [exerciseList, selectedExerciseId]);

  /* -------------------------------------------------------------------------- */
  /* ✅ BottomSheet (단일) + Mode                                                */
  /* -------------------------------------------------------------------------- */

  const sheetRef = useRef<ERBottomSheetRef>(null);
  const [sheetMode, setSheetMode] = useState<SheetMode>(null);

  const openSheet = useCallback(() => {
    sheetRef.current?.open();
  }, []);

  const closeSheet = useCallback(() => {
    sheetRef.current?.close();
  }, []);

  const handleSheetClose = useCallback(() => {
    setSheetMode(null);
  }, []);

  /* -------------------------------------------------------------------------- */
  /* ✅ Forms                                                                    */
  /* -------------------------------------------------------------------------- */

  const [createForm, setCreateForm] = useState<ExerciseForm>({
    name: '',
    category: Category.ALL,
    types: [],
    image: null,
    isEditable: 1,
    shareLevel: 1,
  });

  const [updateForm, setUpdateForm] = useState<ExerciseForm>({
    name: '',
    category: Category.ALL,
    types: [],
    image: null,
    isEditable: 1,
    shareLevel: 1,
  });

  const resetCreateForm = useCallback(() => {
    setCreateForm({
      name: '',
      category: Category.ALL,
      types: [],
      image: null,
      isEditable: 1,
      shareLevel: 1,
    });
  }, []);

  const hydrateUpdateForm = useCallback((exercise: Exercise) => {
    setUpdateForm({
      name: exercise.name ?? '',
      category: (exercise.category as Category) ?? Category.ALL,
      types: (exercise.types as ExerciseType[]) ?? [],
      image: exercise.image ?? null,
      isEditable: exercise.isEditable ?? 1,
      shareLevel: exercise.shareLevel ?? 1,
    });
  }, []);

  /* -------------------------------------------------------------------------- */
  /* ✅ Stable handlers (무한루프 방지)                                          */
  /* -------------------------------------------------------------------------- */

  const handleChangeSearch = useCallback((v: string) => setSearch(v), []);
  const handleChangeCategory = useCallback((v: string) => setCategory(v as Category), []);

  const checkboxDefaultValue = useMemo<string[]>(() => [], []);

  /* -------------------------------------------------------------------------- */
  /* ✅ Open Create / Open Update                                                */
  /* -------------------------------------------------------------------------- */

  const openCreateSheet = useCallback(() => {
    setSheetMode('create');
    openSheet();
  }, [openSheet]);

  const openUpdateSheet = useCallback(
    (id: string) => {
      setSelectedExerciseId(id);

      const ex = exerciseList.find(e => String(e.id) === String(id));
      if (ex) {
        hydrateUpdateForm(ex);
      }

      setSheetMode('update');
      openSheet();
    },
    [exerciseList, hydrateUpdateForm, openSheet]
  );

  /* -------------------------------------------------------------------------- */
  /* ✅ Create form handlers                                                     */
  /* -------------------------------------------------------------------------- */

  const handleCreateChangeImage = useCallback((uri: string | null) => {
    setCreateForm(prev => ({ ...prev, image: uri }));
  }, []);

  const handleCreateChangeName = useCallback((v: string) => {
    setCreateForm(prev => ({ ...prev, name: v }));
  }, []);

  const handleCreateChangeCategory = useCallback((v: string) => {
    setCreateForm(prev => ({ ...prev, category: v as Category }));
  }, []);

  const handleCreateChangeTypes = useCallback((next: string[]) => {
    setCreateForm(prev => ({ ...prev, types: next as ExerciseType[] }));
  }, []);

  const isCreateEnabled = useMemo(() => {
    return (
      createForm.name.trim().length > 0 &&
      createForm.category !== Category.ALL &&
      createForm.types.length > 0
    );
  }, [createForm.name, createForm.category, createForm.types]);

  const handleSubmitCreate = useCallback(async () => {
    if (!isCreateEnabled) {
      return;
    }

    try {
      await createExercise({
        name: createForm.name,
        category: createForm.category,
        types: createForm.types,
        image: createForm.image,
        isEditable: createForm.isEditable,
        shareLevel: createForm.shareLevel,
      });

      Toast.show({
        type: 'success',
        text1: '생성 완료',
        text2: '운동이 생성되었습니다.',
      });

      resetCreateForm();
      closeSheet();
    } catch (e) {
      Toast.show({
        type: 'error',
        text1: '생성 실패',
        text2: '잠시 후 다시 시도해주세요.',
      });
    }
  }, [isCreateEnabled, createExercise, createForm, resetCreateForm, closeSheet]);

  /* -------------------------------------------------------------------------- */
  /* ✅ Update form handlers                                                     */
  /* -------------------------------------------------------------------------- */

  const handleUpdateChangeImage = useCallback((uri: string | null) => {
    setUpdateForm(prev => ({ ...prev, image: uri }));
  }, []);

  const handleUpdateChangeName = useCallback((v: string) => {
    setUpdateForm(prev => ({ ...prev, name: v }));
  }, []);

  const handleUpdateChangeCategory = useCallback((v: string) => {
    setUpdateForm(prev => ({ ...prev, category: v as Category }));
  }, []);

  const handleUpdateChangeTypes = useCallback((next: string[]) => {
    setUpdateForm(prev => ({ ...prev, types: next as ExerciseType[] }));
  }, []);

  const isUpdateEnabled = useMemo(() => {
    return (
      !!selectedExerciseId &&
      updateForm.name.trim().length > 0 &&
      updateForm.category !== Category.ALL &&
      updateForm.types.length > 0
    );
  }, [selectedExerciseId, updateForm.name, updateForm.category, updateForm.types]);

  const handleSubmitUpdate = useCallback(async () => {
    if (!isUpdateEnabled) {
      return;
    }
    if (!selectedExerciseId) {
      return;
    }

    try {
      await updateExercise({
        id: Number(selectedExerciseId),
        name: updateForm.name,
        category: updateForm.category,
        types: updateForm.types,
        image: updateForm.image,
        isEditable: updateForm.isEditable,
        shareLevel: updateForm.shareLevel,
      });

      Toast.show({
        type: 'success',
        text1: '수정 완료',
        text2: '운동이 수정되었습니다.',
      });

      closeSheet();
    } catch (e) {
      Toast.show({
        type: 'error',
        text1: '수정 실패',
        text2: '잠시 후 다시 시도해주세요.',
      });
    }
  }, [isUpdateEnabled, selectedExerciseId, updateExercise, updateForm, closeSheet]);

  /* -------------------------------------------------------------------------- */
  /* ✅ List item select                                                         */
  /* -------------------------------------------------------------------------- */

  const handleSelectExercise = useCallback(
    (id: string) => {
      openUpdateSheet(id);
    },
    [openUpdateSheet]
  );

  const renderExerciseItem = useCallback(
    ({ item }: { item: Exercise }) => (
      <ERTab.Item value={String(item.id)} title={item.name} imageSrc={item.image ?? undefined} />
    ),
    []
  );

  /* -------------------------------------------------------------------------- */
  /* ✅ Sheet Content (mode 분기)                                                */
  /* -------------------------------------------------------------------------- */

  const sheetTitle = useMemo(() => {
    if (sheetMode === 'create') {
      return '운동 생성';
    }
    if (sheetMode === 'update') {
      return '운동 수정';
    }
    return '';
  }, [sheetMode]);

  return (
    <PageLayout
      mode="tab"
      activeTab="Library"
      main={
        <View style={{ flex: 1 }}>
          <VStack style={{ flex: 1 }}>
            <View>
              <ERInput
                value={search}
                onChangeText={handleChangeSearch}
                placeholder="검색"
                containerStyle={{ borderRadius: 999 }}
                inputStyle={{ fontWeight: '700' }}
              />

              <View style={{ height: 16 }} />

              <ERTab
                variant="chip"
                defaultValue={Category.ALL}
                value={category}
                onChange={handleChangeCategory}
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

            <View style={{ flex: 1 }}>
              <ERTab
                variant="image-text-arrow"
                defaultValue={''}
                value={selectedExerciseId}
                onChange={handleSelectExercise}
              >
                <FlatList
                  data={exerciseList}
                  keyExtractor={item => String(item.id)}
                  showsVerticalScrollIndicator={false}
                  renderItem={renderExerciseItem}
                />
              </ERTab>
            </View>
          </VStack>
        </View>
      }
      overlay={({ scrollY }) => (
        <>
          <ERFloatingActionButton scrollY={scrollY} onButtonClick={openCreateSheet} />

          {/* ✅ BottomSheet 단 하나 */}
          <ERBottomSheet ref={sheetRef} snapPoints={['80%']} onClose={handleSheetClose}>
            {/* sheetMode가 null이면 아무것도 안그려도 됨 */}
            {sheetMode ? (
              <View style={styles.sheetContainer}>
                <Text style={[styles.sheetTitle, { color: theme.colors.text }]}>{sheetTitle}</Text>

                <View style={{ height: 18 }} />

                {/* ---------------------------------------------------------------- */}
                {/* ✅ CREATE CONTENT                                                 */}
                {/* ---------------------------------------------------------------- */}
                {sheetMode === 'create' && (
                  <>
                    <HStack justify="center">
                      <ERImageUploader
                        value={createForm.image ?? null}
                        onChange={handleCreateChangeImage}
                      />
                    </HStack>

                    <View style={{ height: 26 }} />

                    <ERLabel label="운동 이름" required />
                    <View style={{ height: 10 }} />
                    <ERInput
                      value={createForm.name}
                      onChangeText={handleCreateChangeName}
                      placeholder="운동 이름을 입력해 주세요"
                      containerStyle={{ borderRadius: 14 }}
                      inputStyle={{ fontWeight: '700' }}
                    />

                    <View style={{ height: 22 }} />

                    <ERLabel label="운동 부위" required />
                    <View style={{ height: 12 }} />
                    <ERTab
                      variant="chip"
                      defaultValue={Category.CHEST}
                      value={createForm.category}
                      onChange={handleCreateChangeCategory}
                    >
                      <ERTab.Item value={Category.CHEST}>가슴</ERTab.Item>
                      <ERTab.Item value={Category.BACK}>등</ERTab.Item>
                      <ERTab.Item value={Category.SHOULDER}>어깨</ERTab.Item>
                      <ERTab.Item value={Category.LEG}>하체</ERTab.Item>
                      <ERTab.Item value={Category.ARM}>팔</ERTab.Item>
                      <ERTab.Item value={Category.ETC}>기타</ERTab.Item>
                    </ERTab>

                    <View style={{ height: 22 }} />

                    <ERLabel label="타입" required />
                    <View style={{ height: 14 }} />

                    <ERCheckbox
                      variant="text"
                      defaultValue={checkboxDefaultValue}
                      value={createForm.types as string[]}
                      onChange={handleCreateChangeTypes}
                    >
                      <View style={styles.typeRow}>
                        <ERCheckbox.Item value="WEIGHT" title="무게(kg)" />
                        <ERCheckbox.Item value="COUNT" title="횟수" />
                        <ERCheckbox.Item value="TIME" title="시간" />
                      </View>
                    </ERCheckbox>

                    <View style={{ height: 28 }} />

                    <ERButton
                      variant="solid"
                      disabled={!isCreateEnabled}
                      onPress={handleSubmitCreate}
                      containerStyle={{
                        width: '100%',
                        height: 54,
                        borderRadius: 14,
                        backgroundColor: isCreateEnabled
                          ? theme.colors.primary1
                          : theme.colors.gray5,
                      }}
                    >
                      추가하기
                    </ERButton>
                  </>
                )}

                {/* ---------------------------------------------------------------- */}
                {/* ✅ UPDATE CONTENT                                                 */}
                {/* ---------------------------------------------------------------- */}
                {sheetMode === 'update' && (
                  <>
                    <HStack justify="center">
                      <ERImageUploader
                        value={updateForm.image ?? null}
                        onChange={handleUpdateChangeImage}
                      />
                    </HStack>

                    <View style={{ height: 26 }} />

                    <ERLabel label="운동 이름" required />
                    <View style={{ height: 10 }} />
                    <ERInput
                      value={updateForm.name}
                      onChangeText={handleUpdateChangeName}
                      placeholder="운동 이름을 입력해 주세요"
                      containerStyle={{ borderRadius: 14 }}
                      inputStyle={{ fontWeight: '700' }}
                    />

                    <View style={{ height: 22 }} />

                    <ERLabel label="운동 부위" required />
                    <View style={{ height: 12 }} />
                    <ERTab
                      variant="chip"
                      defaultValue={Category.CHEST}
                      value={updateForm.category}
                      onChange={handleUpdateChangeCategory}
                    >
                      <ERTab.Item value={Category.CHEST}>가슴</ERTab.Item>
                      <ERTab.Item value={Category.BACK}>등</ERTab.Item>
                      <ERTab.Item value={Category.SHOULDER}>어깨</ERTab.Item>
                      <ERTab.Item value={Category.LEG}>하체</ERTab.Item>
                      <ERTab.Item value={Category.ARM}>팔</ERTab.Item>
                      <ERTab.Item value={Category.ETC}>기타</ERTab.Item>
                    </ERTab>

                    <View style={{ height: 22 }} />

                    <ERLabel label="타입" required />
                    <View style={{ height: 14 }} />

                    <ERCheckbox
                      variant="text"
                      defaultValue={checkboxDefaultValue}
                      value={updateForm.types as string[]}
                      onChange={handleUpdateChangeTypes}
                    >
                      <View style={styles.typeRow}>
                        <ERCheckbox.Item value="WEIGHT" title="무게(kg)" />
                        <ERCheckbox.Item value="COUNT" title="횟수" />
                        <ERCheckbox.Item value="TIME" title="시간" />
                      </View>
                    </ERCheckbox>

                    <View style={{ height: 28 }} />

                    <ERButton
                      variant="solid"
                      disabled={!isUpdateEnabled}
                      onPress={handleSubmitUpdate}
                      containerStyle={{
                        width: '100%',
                        height: 54,
                        borderRadius: 14,
                        backgroundColor: isUpdateEnabled
                          ? theme.colors.primary1
                          : theme.colors.gray5,
                      }}
                    >
                      수정하기
                    </ERButton>
                  </>
                )}
              </View>
            ) : null}
          </ERBottomSheet>
        </>
      )}
    />
  );
};

export default LibraryScreen;

const styles = StyleSheet.create({
  sheetContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 30,
  },

  sheetTitle: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '900',
  },

  typeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
});
