import React from 'react';
import PageLayout from '@/components/common/PageLayout/PageLayout';
import ERFloatingActionButton from '@/components/common/ERFloatingActionButton/ERFloatingActionButton';
import { useLibraryContent } from '@/hooks/feature/useLibraryContent';
import LibraryExerciseSheet from '@/components/feature/LibraryExerciseSheet/LibraryExerciseSheet';
import LibraryContent from '@/components/feature/Library/LibraryContent';

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
    resetSheetMode,
    changeSearch,
    changeCategory,
    openCreateSheet,
    changeCreateImage,
    changeCreateName,
    changeCreateCategory,
    changeCreateTypes,
    submitCreate,
    changeUpdateImage,
    changeUpdateName,
    changeUpdateCategory,
    changeUpdateTypes,
    submitUpdate,
    selectExercise,
  } = useLibraryContent();

  return (
    <PageLayout
      mode="tab"
      activeTab="Library"
      main={
        <LibraryContent
          search={search}
          category={category}
          exerciseList={exerciseList}
          selectedExerciseId={selectedExerciseId}
          onChangeSearch={changeSearch}
          onChangeCategory={changeCategory}
          onSelectExercise={selectExercise}
        />
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
            onClose={resetSheetMode}
            onCreateChangeImage={changeCreateImage}
            onCreateChangeName={changeCreateName}
            onCreateChangeCategory={changeCreateCategory}
            onCreateChangeTypes={changeCreateTypes}
            onSubmitCreate={submitCreate}
            onUpdateChangeImage={changeUpdateImage}
            onUpdateChangeName={changeUpdateName}
            onUpdateChangeCategory={changeUpdateCategory}
            onUpdateChangeTypes={changeUpdateTypes}
            onSubmitUpdate={submitUpdate}
          />
        </>
      )}
    />
  );
};

export default LibraryScreen;
