import React from 'react';
import { View } from 'react-native';
import ERBottomSheet, { ERBottomSheetRef } from '@/components/common/ERBottomSheet/ERBottomSheet';
import ERInput from '@/components/common/ERInput/ERInput';
import ERTab from '@/components/common/ERTab/ERTab';
import { Category } from '@/types/common';
import type { Exercise } from '@/types/model';
import { ExerciseList } from '@/components/feature/ExerciseList/ExerciseList';

type RoutineExerciseSelectBottomSheetProps = {
  bottomSheetRef: React.RefObject<ERBottomSheetRef>;
  category: Category;
  onChangeCategory: (next: Category) => void;
  search: string;
  onChangeSearch: (next: string) => void;
  exerciseList: Exercise[];
  selectedExerciseId: string;
  onSelectExercise: (exerciseId: string) => void;
  onClose: () => void;
};

const RoutineExerciseSelectBottomSheet: React.FC<RoutineExerciseSelectBottomSheetProps> = ({
  bottomSheetRef,
  category,
  onChangeCategory,
  search,
  onChangeSearch,
  exerciseList,
  selectedExerciseId,
  onSelectExercise,
  onClose,
}) => {
  return (
    <ERBottomSheet ref={bottomSheetRef} onClose={onClose}>
      <View style={{ paddingVertical: 16 }}>
        <ERInput
          value={search}
          onChangeText={onChangeSearch}
          placeholder="검색"
          containerStyle={{ borderRadius: 999 }}
          inputStyle={{ fontWeight: '700' }}
        />

        <View style={{ height: 16 }} />

        <ERTab
          variant="chip"
          defaultValue={Category.ALL}
          value={category}
          onChange={(v: string) => onChangeCategory(v as Category)}
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

      <View style={{ height: 300 }}>
        <ExerciseList
          data={exerciseList}
          selectedId={selectedExerciseId}
          onSelect={onSelectExercise}
        />
      </View>
    </ERBottomSheet>
  );
};

export default RoutineExerciseSelectBottomSheet;
export type { RoutineExerciseSelectBottomSheetProps };
