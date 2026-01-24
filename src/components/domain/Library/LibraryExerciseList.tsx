import React, { useCallback } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import ERTab from '@/components/ui/ERTab/ERTab';
import { Exercise } from '@/types/model';

interface Props {
  data: Exercise[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export const LibraryExerciseList: React.FC<Props> = ({ data, selectedId, onSelect }) => {
  const renderExerciseItem = useCallback(
    ({ item }: { item: Exercise }) => (
      <ERTab.Item value={String(item.id)} title={item.name} imageSrc={item.image ?? undefined} />
    ),
    []
  );

  return (
    <View style={styles.flex1}>
      <ERTab variant="image-text-arrow" defaultValue={''} value={selectedId} onChange={onSelect}>
        <FlatList
          data={data}
          keyExtractor={item => String(item.id)}
          showsVerticalScrollIndicator={false}
          renderItem={renderExerciseItem}
        />
      </ERTab>
    </View>
  );
};

const styles = StyleSheet.create({
  flex1: {
    flex: 1,
  },
});
