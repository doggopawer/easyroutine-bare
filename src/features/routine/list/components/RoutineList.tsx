import { Routine } from '@/features/app/model/types';
import ERSwipeableAccordion from '@/headful/ERSwipeableAccordion';
import React from 'react';
import { View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import RoutineSummary from './RoutineSummary';
import RoutineExerciseList from '@/features/routine-exercise/list/RoutineExerciseList';
import { Color } from '@/features/app/color/types';
import ERIconTextButton from '@/headful/ERIconTextButton';
import RoutineNavigateToEditButton from '../../navigate/RoutineNavigateToEditButton';
import { HStack, VStack } from '@/shared/layout';
import RoutineNavigateToStartButton from '../../navigate/RoutineNavigateToStartButton';

type RoutineListProps = {
  routines: Routine[];
  onNavigateToEditPress: (routineId: string) => void;
  onNavigateToStartPress: (routineId: string) => void;
};

const RoutineList = ({
  routines,
  onNavigateToEditPress,
  onNavigateToStartPress,
}: RoutineListProps) => {
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
          hidden={
            <VStack gap={12}>
              <RoutineExerciseList routineExercises={item.routineExercises} />
              <HStack justify="space-around">
                <RoutineNavigateToEditButton
                  routineId={item.id.toString()}
                  onNavigateToEditPress={onNavigateToEditPress}
                />
                <RoutineNavigateToStartButton
                  routineId={item.id.toString()}
                  onNavigateToStartPress={onNavigateToStartPress}
                />
              </HStack>
            </VStack>
          }
        />
      )}
      ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
      //   scrollEnabled={true}
    />
  );
};

export default RoutineList;
