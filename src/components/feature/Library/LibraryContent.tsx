import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Category } from '@/types/common';
import { VStack } from '@/components/common/VStack/VStack';
import ERFilter from '@/components/common/ERFilter/ERFilter';
import { Exercise } from '@/types/model';
import { ExerciseList } from '@/components/feature/ExerciseList/ExerciseList';

type LibraryContentProps = {
  search: string;
  category: Category;
  exerciseList: Exercise[];
  selectedExerciseId: string;
  onChangeSearch: (value: string) => void;
  onChangeCategory: (value: Category) => void;
  onSelectExercise: (id: string) => void;
};

const LibraryContent: React.FC<LibraryContentProps> = ({
  search,
  category,
  exerciseList,
  selectedExerciseId,
  onChangeSearch,
  onChangeCategory,
  onSelectExercise,
}) => {
  return (
    <View style={styles.flex1}>
      <VStack style={styles.flex1}>
        <ERFilter
          value={search}
          onChangeText={onChangeSearch}
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
          onFilterChange={v => onChangeCategory(v as Category)}
        />

        <ExerciseList
          data={exerciseList}
          selectedId={selectedExerciseId}
          onSelect={onSelectExercise}
        />
      </VStack>
    </View>
  );
};

export default LibraryContent;
export type { LibraryContentProps };

const styles = StyleSheet.create({
  flex1: {
    flex: 1,
  },
});
