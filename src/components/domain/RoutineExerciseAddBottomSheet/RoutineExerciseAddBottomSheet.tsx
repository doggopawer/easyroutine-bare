import React from 'react';
import { View, FlatList } from 'react-native';
import ERBottomSheet, { ERBottomSheetRef } from '@/components/ui/ERBottomSheet/ERBottomSheet';
import ERInput from '@/components/ui/ERInput/ERInput';
import ERTab from '@/components/ui/ERTab/ERTab';
import { Category } from '@/types/common';
import ERCheckbox from '@/components/ui/ERCheckbox/ERCheckbox';
import ERButton from '@/components/ui/ERButton/ERButton';
import type { Exercise } from '@/types/model';

type RoutineExerciseAddBottomSheetProps = {
  bottomSheetRef: React.RefObject<ERBottomSheetRef>;
  category: Category;
  onChangeCategory: (next: Category) => void;
  search: string;
  onChangeSearch: (next: string) => void;
  exerciseList: Exercise[];
  selectedExerciseIds: string[];
  onChangeSelectedExerciseIds: (next: string[]) => void;
  onClose: () => void;
  onConfirmAdd: () => void;
};

const RoutineExerciseAddBottomSheet: React.FC<RoutineExerciseAddBottomSheetProps> = ({
  bottomSheetRef,
  category,
  onChangeCategory,
  search,
  onChangeSearch,
  exerciseList,
  selectedExerciseIds,
  onChangeSelectedExerciseIds,
  onClose,
  onConfirmAdd,
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

      {/* ✅ 스크롤 리스트 영역 */}
      <View style={{ height: 300 }}>
        <ERCheckbox
          variant="image-text"
          defaultValue={[]}
          value={selectedExerciseIds}
          onChange={onChangeSelectedExerciseIds}
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
        <ERButton variant="solid" onPress={onConfirmAdd}>
          운동 추가
        </ERButton>
      </View>
    </ERBottomSheet>
  );
};

export default RoutineExerciseAddBottomSheet;
export type { RoutineExerciseAddBottomSheetProps };
