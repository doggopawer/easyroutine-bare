import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ERBottomSheet, { ERBottomSheetRef } from '@/components/common/ERBottomSheet/ERBottomSheet';
import ERButton from '@/components/common/ERButton/ERButton';
import ERLabel from '@/components/common/ERLabel/ERLabel';
import ERImageUploader from '@/components/common/ERImageUploader/ERImageUploader';
import { HStack } from '@/components/common/HStack/HStack';
import ERCheckbox from '@/components/common/ERCheckbox/ERCheckbox';
import ERInput from '@/components/common/ERInput/ERInput';
import ERTab from '@/components/common/ERTab/ERTab';
import { Category } from '@/types/common';
import { useTheme } from '@/theme/ThemeProvider/ThemeProvider';
import type { RefObject } from 'react';
import type { ExerciseForm, SheetMode } from '@/hooks/feature/useLibraryContent';

type LibraryExerciseSheetProps = {
  sheetRef: RefObject<ERBottomSheetRef>;
  sheetMode: SheetMode;
  sheetTitle: string;
  checkboxDefaultValue: string[];
  createForm: ExerciseForm;
  updateForm: ExerciseForm;
  isCreateEnabled: boolean;
  isUpdateEnabled: boolean;
  onClose: () => void;
  onCreateChangeImage: (uri: string | null) => void;
  onCreateChangeName: (value: string) => void;
  onCreateChangeCategory: (value: string) => void;
  onCreateChangeTypes: (next: string[]) => void;
  onSubmitCreate: () => void;
  onUpdateChangeImage: (uri: string | null) => void;
  onUpdateChangeName: (value: string) => void;
  onUpdateChangeCategory: (value: string) => void;
  onUpdateChangeTypes: (next: string[]) => void;
  onSubmitUpdate: () => void;
};

const LibraryExerciseSheet: React.FC<LibraryExerciseSheetProps> = ({
  sheetRef,
  sheetMode,
  sheetTitle,
  checkboxDefaultValue,
  createForm,
  updateForm,
  isCreateEnabled,
  isUpdateEnabled,
  onClose,
  onCreateChangeImage,
  onCreateChangeName,
  onCreateChangeCategory,
  onCreateChangeTypes,
  onSubmitCreate,
  onUpdateChangeImage,
  onUpdateChangeName,
  onUpdateChangeCategory,
  onUpdateChangeTypes,
  onSubmitUpdate,
}) => {
  const { theme } = useTheme();

  return (
    <ERBottomSheet ref={sheetRef} snapPoints={['80%']} onClose={onClose}>
      {sheetMode ? (
        <View style={styles.sheetContainer}>
          <Text style={[styles.sheetTitle, { color: theme.colors.text }]}>{sheetTitle}</Text>

          <View style={styles.spacer18} />

          {sheetMode === 'create' && (
            <>
              <HStack justify="center">
                <ERImageUploader value={createForm.image ?? null} onChange={onCreateChangeImage} />
              </HStack>

              <View style={styles.spacer26} />

              <ERLabel label="운동 이름" required />
              <View style={styles.spacer10} />
              <ERInput
                value={createForm.name}
                onChangeText={onCreateChangeName}
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
                onChange={onCreateChangeCategory}
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
                onChange={onCreateChangeTypes}
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
                onPress={onSubmitCreate}
                containerStyle={{
                  ...styles.submitButton,
                  backgroundColor: isCreateEnabled ? theme.colors.primary1 : theme.colors.gray5,
                }}
              >
                추가하기
              </ERButton>
            </>
          )}

          {sheetMode === 'update' && (
            <>
              <HStack justify="center">
                <ERImageUploader value={updateForm.image ?? null} onChange={onUpdateChangeImage} />
              </HStack>

              <View style={styles.spacer26} />

              <ERLabel label="운동 이름" required />
              <View style={styles.spacer10} />
              <ERInput
                value={updateForm.name}
                onChangeText={onUpdateChangeName}
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
                onChange={onUpdateChangeCategory}
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
                onChange={onUpdateChangeTypes}
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
                onPress={onSubmitUpdate}
                containerStyle={{
                  ...styles.submitButton,
                  backgroundColor: isUpdateEnabled ? theme.colors.primary1 : theme.colors.gray5,
                }}
              >
                수정하기
              </ERButton>
            </>
          )}
        </View>
      ) : null}
    </ERBottomSheet>
  );
};

export default LibraryExerciseSheet;
export type { LibraryExerciseSheetProps };

const styles = StyleSheet.create({
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
