import { Routine } from '@/features/app/model/types';
import ERSwipeableAccordion from '@/headful/ERSwipeableAccordion';
import React from 'react';
import { View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import RoutineSummary from './RoutineSummary';
import RoutineExerciseList from '@/features/routine-exercise/list/RoutineExerciseList';
import { Color } from '@/features/app/color/types';

type RoutineListProps = {
  routines: Routine[];
};

const RoutineList = ({ routines }: RoutineListProps) => {
  return (
    <FlatList
      data={routines}
      keyExtractor={item => item.id.toString()}
      renderItem={({ item }) => (
        <ERSwipeableAccordion
          key={item.id}
          visible={
            <RoutineSummary
              title={item.name}
              countText={item.routineExercises.length.toString()}
              color={item.color as Color}
            />
          }
          hidden={<RoutineExerciseList routineExercises={item.routineExercises} />}
        />
      )}
      ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
      //   scrollEnabled={true}
    />
  );
};

export default RoutineList;
