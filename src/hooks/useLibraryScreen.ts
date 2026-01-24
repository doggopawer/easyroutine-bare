import { useCallback, useMemo, useRef, useState } from 'react';
import { useExerciseListQuery } from '@/hooks/useExerciseListQuery';
import { useExerciseCreateMutation } from '@/hooks/useExerciseCreateMutation';
import { useExerciseUpdateMutation } from '@/hooks/useExerciseUpdateMutation';
import { Category } from '@/types/common';
import { Exercise } from '@/types/model';
import { ERBottomSheetRef } from '@/components/ui/ERBottomSheet/ERBottomSheet';
import Toast from 'react-native-toast-message';

export type ExerciseType = 'WEIGHT' | 'COUNT' | 'TIME';
export type ExerciseForm = Omit<Exercise, 'id'>;
export type SheetMode = 'create' | 'update' | null;

export const useLibraryScreen = () => {
  const { res } = useExerciseListQuery({});
  const exerciseList = useMemo(() => res?.body ?? [], [res]);

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

  return {
    // State
    search,
    setSearch,
    category,
    setCategory,
    selectedExerciseId,
    setSelectedExerciseId,
    sheetMode,
    setSheetMode,
    createForm,
    setCreateForm,
    updateForm,
    setUpdateForm,
    exerciseList,

    // Refs
    sheetRef,

    // Computed
    selectedExercise,
    checkboxDefaultValue,
    isCreateEnabled,
    isUpdateEnabled,
    sheetTitle,

    // Handlers
    openSheet,
    closeSheet,
    handleSheetClose,
    resetCreateForm,
    hydrateUpdateForm,
    handleChangeSearch,
    handleChangeCategory,
    openCreateSheet,
    openUpdateSheet,
    handleCreateChangeImage,
    handleCreateChangeName,
    handleCreateChangeCategory,
    handleCreateChangeTypes,
    handleSubmitCreate,
    handleUpdateChangeImage,
    handleUpdateChangeName,
    handleUpdateChangeCategory,
    handleUpdateChangeTypes,
    handleSubmitUpdate,
    handleSelectExercise,
  };
};
