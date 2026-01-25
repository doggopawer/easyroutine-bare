import React from 'react';
import { View, StyleSheet } from 'react-native';
import PageLayout from '@/components/ui/PageLayout/PageLayout';
import { Category } from '@/types/common';
import { VStack } from '@/components/ui/VStack/VStack';
import ERFloatingActionButton from '@/components/ui/ERFloatingActionButton/ERFloatingActionButton';
import { useLibraryScreen } from '@/hooks/useLibraryScreen';
import ERFilter from '@/components/ui/ERFilter/ERFilter';
import { ExerciseList } from '@/components/domain/ExerciseList/ExerciseList';
import LibraryExerciseSheet from '@/components/domain/LibraryExerciseSheet/LibraryExerciseSheet';

const LibraryScreen: React.FC = () => {
  const {
    // State
    search,
    category,
    selectedExerciseId,
    sheetMode,
    createForm,
    updateForm,
    exerciseList,

    // Refs
    sheetRef,

    // Computed
    checkboxDefaultValue,
    isCreateEnabled,
    isUpdateEnabled,
    sheetTitle,

    // Handlers
    handleSheetClose,
    handleChangeSearch,
    handleChangeCategory,
    openCreateSheet,
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
  } = useLibraryScreen();

  return (
    <PageLayout
      mode="tab"
      activeTab="Library"
      main={
        <View style={styles.flex1}>
          <VStack style={styles.flex1}>
            <ERFilter
              value={search}
              onChangeText={handleChangeSearch}
              placeholder="검색"
              filterItems={[
                { label: '전체', value: Category.ALL },
                { label: '가슴', value: Category.CHEST },
                { label: '등', value: Category.BACK },
                { label: '어깨', value: Category.SHOULDER },
                { label: '하체', value: Category.LEG },
                { label: '팔', value: Category.ARM },
                { label: '기타', value: Category.ETC },
              ]}
              selectedFilter={category}
              onFilterChange={v => handleChangeCategory(v as Category)}
            />

            <ExerciseList
              data={exerciseList}
              selectedId={selectedExerciseId}
              onSelect={handleSelectExercise}
            />
          </VStack>
        </View>
      }
      overlay={({ scrollY }) => (
        <>
          <ERFloatingActionButton scrollY={scrollY} onButtonClick={openCreateSheet} />

          <LibraryExerciseSheet
            sheetRef={sheetRef}
            sheetMode={sheetMode}
            sheetTitle={sheetTitle}
            checkboxDefaultValue={checkboxDefaultValue}
            createForm={createForm}
            updateForm={updateForm}
            isCreateEnabled={isCreateEnabled}
            isUpdateEnabled={isUpdateEnabled}
            onClose={handleSheetClose}
            onCreateChangeImage={handleCreateChangeImage}
            onCreateChangeName={handleCreateChangeName}
            onCreateChangeCategory={handleCreateChangeCategory}
            onCreateChangeTypes={handleCreateChangeTypes}
            onSubmitCreate={handleSubmitCreate}
            onUpdateChangeImage={handleUpdateChangeImage}
            onUpdateChangeName={handleUpdateChangeName}
            onUpdateChangeCategory={handleUpdateChangeCategory}
            onUpdateChangeTypes={handleUpdateChangeTypes}
            onSubmitUpdate={handleSubmitUpdate}
          />
        </>
      )}
    />
  );
};

export default LibraryScreen;

const styles = StyleSheet.create({
  flex1: {
    flex: 1,
  },
});
