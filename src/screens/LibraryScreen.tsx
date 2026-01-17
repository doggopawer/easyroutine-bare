import React, { useCallback } from 'react';
import { View, StyleSheet, FlatList, Text } from 'react-native';
import PageLayout from '@/components/PageLayout/PageLayout';
import ERInput from '@/components/ERInput/ERInput';
import ERTab from '@/components/ERTab/ERTab';
import { Category } from '@/types/common';
import { VStack } from '@/components/VStack/VStack';
import { useTheme } from '@/theme/ThemeProvider/ThemeProvider';

import ERBottomSheet from '@/components/ERBottomSheet/ERBottomSheet';
import ERButton from '@/components/ERButton/ERButton';
import ERLabel from '@/components/ERLabel/ERLabel';
import ERImageUploader from '@/components/ERImageUploader/ERImageUploader';
import { HStack } from '@/components/HStack/HStack';
import ERCheckbox from '@/components/ERCheckbox/ERCheckbox';
import { Exercise } from '@/types/model';
import ERFloatingActionButton from '@/components/ERFloatingActionButton/ERFloatingActionButton';
import { useLibraryScreen } from '@/hooks/useLibraryScreen';

const LibraryScreen: React.FC = () => {
  const { theme } = useTheme();

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

  const renderExerciseItem = useCallback(
    ({ item }: { item: Exercise }) => (
      <ERTab.Item value={String(item.id)} title={item.name} imageSrc={item.image ?? undefined} />
    ),
    []
  );

  return (
    <PageLayout
      mode="tab"
      activeTab="Library"
      main={
        <View style={styles.flex1}>
          <VStack style={styles.flex1}>
            <View>
              <ERInput
                value={search}
                onChangeText={handleChangeSearch}
                placeholder="검색"
                containerStyle={styles.searchInputContainer}
                inputStyle={styles.fontWeight700}
              />

              <View style={styles.spacer16} />

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

            <View style={styles.flex1}>
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

                <View style={styles.spacer18} />

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

                    <View style={styles.spacer26} />

                    <ERLabel label="운동 이름" required />
                    <View style={styles.spacer10} />
                    <ERInput
                      value={createForm.name}
                      onChangeText={handleCreateChangeName}
                      placeholder="운동 이름을 입력해 주세요"
                      containerStyle={styles.borderRadius14}
                      inputStyle={styles.fontWeight700}
                    />

                    <View style={styles.spacer22} />

                    <ERLabel label="운동 부위" required />
                    <View style={styles.spacer12} />
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

                    <View style={styles.spacer22} />

                    <ERLabel label="타입" required />
                    <View style={styles.spacer14} />

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

                    <View style={styles.spacer28} />

                    <ERButton
                      variant="solid"
                      disabled={!isCreateEnabled}
                      onPress={handleSubmitCreate}
                      containerStyle={{
                        ...styles.submitButton,
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

                    <View style={styles.spacer26} />

                    <ERLabel label="운동 이름" required />
                    <View style={styles.spacer10} />
                    <ERInput
                      value={updateForm.name}
                      onChangeText={handleUpdateChangeName}
                      placeholder="운동 이름을 입력해 주세요"
                      containerStyle={styles.borderRadius14}
                      inputStyle={styles.fontWeight700}
                    />

                    <View style={styles.spacer22} />

                    <ERLabel label="운동 부위" required />
                    <View style={styles.spacer12} />
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

                    <View style={styles.spacer22} />

                    <ERLabel label="타입" required />
                    <View style={styles.spacer14} />

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

                    <View style={styles.spacer28} />

                    <ERButton
                      variant="solid"
                      disabled={!isUpdateEnabled}
                      onPress={handleSubmitUpdate}
                      containerStyle={{
                        ...styles.submitButton,
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
  flex1: {
    flex: 1,
  },
  searchInputContainer: {
    borderRadius: 999,
  },
  fontWeight700: {
    fontWeight: '700',
  },
  borderRadius14: {
    borderRadius: 14,
  },
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
  submitButton: {
    width: '100%',
    height: 54,
    borderRadius: 14,
  },
  spacer10: {
    height: 10,
  },
  spacer12: {
    height: 12,
  },
  spacer14: {
    height: 14,
  },
  spacer16: {
    height: 16,
  },
  spacer18: {
    height: 18,
  },
  spacer22: {
    height: 22,
  },
  spacer26: {
    height: 26,
  },
  spacer28: {
    height: 28,
  },
});
