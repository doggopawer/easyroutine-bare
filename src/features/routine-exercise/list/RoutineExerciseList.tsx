import { RoutineExercise } from '@/features/app/model/types';
import RoutineExerciseItem from '@/features/routine-exercise/list/RoutineExerciseItem';
import React from 'react';
import { View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';

type RoutineExerciseListProps = {
  routineExercises: RoutineExercise[];
};

const RoutineExerciseList = ({ routineExercises }: RoutineExerciseListProps) => {
  return (
    <FlatList
      data={routineExercises}
      keyExtractor={item => item.id.toString()}
      renderItem={({ item }) => (
        <RoutineExerciseItem
          name={item.exercise.name}
          imageSrc={item.exercise.image ?? ''}
          setCount={item.sets.length}
        />
      )}
      ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
      scrollEnabled={false}
    />
  );
};

export default RoutineExerciseList;
