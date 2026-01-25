import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import ERSwipeableAccordion from '@/components/common/ERSwipeableAccordion/ERSwipeableAccordion';
import ERIconTitleSubTitle from '@/components/common/ERIconTitleSubTitle/ERIconTitleSubTitle';
import { VStack } from '@/components/common/VStack/VStack';
import { HStack } from '@/components/common/HStack/HStack';
import ERImageTitleSubtitle from '@/components/common/ERImageTitleSubTitle/ERImageTitleSubTitle';
import ERIconTextButton from '@/components/common/ERIconTextButton/ERIconTextButton';
import { useTheme } from '@/theme/ThemeProvider/ThemeProvider';
import FireIcon from '@/assets/images/fire.svg';
import type { Routine } from '@/types/model';
import type { Color } from '@/types/common';

type RoutineListContentProps = {
  routineList: Routine[];
  onDeletePress: (routineId: string) => void;
  onEditPress: (routine: Routine) => void;
  onStartPress: (routine: Routine) => void;
};

const RoutineListContent: React.FC<RoutineListContentProps> = ({
  routineList,
  onDeletePress,
  onEditPress,
  onStartPress,
}) => {
  const { theme } = useTheme();

  return (
    <FlatList
      data={routineList}
      keyExtractor={item => item.id.toString()}
      renderItem={({ item }) => (
        <ERSwipeableAccordion
          key={item.id}
          onDeletePress={() => onDeletePress(item.id.toString())}
          visible={
            <ERIconTitleSubTitle
              title={item.name}
              countText={item.routineExercises.length.toString()}
              color={item.color as Color}
            />
          }
          hidden={
            <VStack gap={12}>
              <FlatList
                data={item.routineExercises}
                keyExtractor={ex => ex.id.toString()}
                renderItem={({ item: ex }) => (
                  <ERImageTitleSubtitle
                    title={ex.exercise.name}
                    subtitle={`${ex.sets.length} 세트`}
                    imageSrc={ex.exercise.image ?? ''}
                  />
                )}
                ItemSeparatorComponent={() => <View style={styles.spacer10} />}
                scrollEnabled={false}
              />

              <HStack justify="space-around">
                <ERIconTextButton
                  color={theme.colors.primary1}
                  icon={<FireIcon />}
                  text="루틴 수정하기"
                  onPress={() => onEditPress(item)}
                />

                <ERIconTextButton
                  color={theme.colors.primary1}
                  icon={<FireIcon />}
                  text="루틴 시작하기"
                  onPress={() => onStartPress(item)}
                />
              </HStack>
            </VStack>
          }
        />
      )}
      ItemSeparatorComponent={() => <View style={styles.spacer10} />}
    />
  );
};

export default RoutineListContent;
export type { RoutineListContentProps };

const styles = StyleSheet.create({
  spacer10: {
    height: 10,
  },
});
