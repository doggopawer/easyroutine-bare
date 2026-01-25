import React from 'react';
import { FlatList, View } from 'react-native';
import ERSwipeableAccordion from '@/components/ui/ERSwipeableAccordion/ERSwipeableAccordion';
import ERImageTitleSubtitle from '@/components/ui/ERImageTitleSubTitle/ERImageTitleSubTitle';
import ERTable from '@/components/ui/ERTable/ERTable';
import type { RoutineExercise, Set } from '@/types/model';
import type { ActiveCell, MetricType } from '@/hooks/useSetUpdateBottomSheet';

type RoutineExerciseAccordionListProps = {
  routineExercises: RoutineExercise[];
  activeCell: ActiveCell | null;
  getCellValue: (set: Set, metric: MetricType) => string;
  onOpenCell: (cell: ActiveCell) => void;
  onDeleteExercise: (routineExerciseId: string) => void;
};

const RoutineExerciseAccordionList: React.FC<RoutineExerciseAccordionListProps> = ({
  routineExercises,
  activeCell,
  getCellValue,
  onOpenCell,
  onDeleteExercise,
}) => {
  return (
    <FlatList
      data={routineExercises}
      keyExtractor={item => item.id.toString()}
      renderItem={({ item: routineExercise }) => (
        <ERSwipeableAccordion
          key={routineExercise.id.toString()}
          onDeletePress={() => onDeleteExercise(routineExercise.id.toString())}
          visible={
            <ERImageTitleSubtitle
              variant="lg"
              title={routineExercise.exercise.name}
              subtitle={`${routineExercise.sets.length}세트`}
              imageSrc={routineExercise.exercise.image ?? 'https://via.placeholder.com/150'}
            />
          }
          hidden={
            <ERTable>
              <ERTable.Header>
                <ERTable.Cell width={50}>
                  <ERTable.Text text="세트" />
                </ERTable.Cell>
                <ERTable.Cell>
                  <ERTable.Text text="KG" />
                </ERTable.Cell>
                <ERTable.Cell>
                  <ERTable.Text text="횟수" />
                </ERTable.Cell>
                <ERTable.Cell>
                  <ERTable.Text text="시간" />
                </ERTable.Cell>
                <ERTable.Cell>
                  <ERTable.Text text="휴식" />
                </ERTable.Cell>
              </ERTable.Header>

              <ERTable.Body>
                {routineExercise.sets.map((set: Set) => (
                  <ERTable.Row key={set.id.toString()}>
                    <ERTable.Cell width={50}>
                      <ERTable.Text text={String(set.order)} />
                    </ERTable.Cell>

                    <ERTable.Cell>
                      <ERTable.Input
                        value={getCellValue(set, 'weight')}
                        isActive={
                          activeCell?.routineExerciseId === routineExercise.id.toString() &&
                          activeCell?.setId === set.id.toString() &&
                          activeCell?.metric === 'weight'
                        }
                        onPress={() =>
                          onOpenCell({
                            routineExerciseId: routineExercise.id.toString(),
                            setId: set.id.toString(),
                            metric: 'weight',
                            value: getCellValue(set, 'weight'),
                          })
                        }
                      />
                    </ERTable.Cell>

                    <ERTable.Cell>
                      <ERTable.Input
                        value={getCellValue(set, 'rep')}
                        isActive={
                          activeCell?.routineExerciseId === routineExercise.id.toString() &&
                          activeCell?.setId === set.id.toString() &&
                          activeCell?.metric === 'rep'
                        }
                        onPress={() =>
                          onOpenCell({
                            routineExerciseId: routineExercise.id.toString(),
                            setId: set.id.toString(),
                            metric: 'rep',
                            value: getCellValue(set, 'rep'),
                          })
                        }
                      />
                    </ERTable.Cell>

                    <ERTable.Cell>
                      <ERTable.Input
                        value={getCellValue(set, 'exerciseSec')}
                        isActive={
                          activeCell?.routineExerciseId === routineExercise.id.toString() &&
                          activeCell?.setId === set.id.toString() &&
                          activeCell?.metric === 'exerciseSec'
                        }
                        onPress={() =>
                          onOpenCell({
                            routineExerciseId: routineExercise.id.toString(),
                            setId: set.id.toString(),
                            metric: 'exerciseSec',
                            value: getCellValue(set, 'exerciseSec'),
                          })
                        }
                      />
                    </ERTable.Cell>

                    <ERTable.Cell>
                      <ERTable.Input
                        value={getCellValue(set, 'restSec')}
                        isActive={
                          activeCell?.routineExerciseId === routineExercise.id.toString() &&
                          activeCell?.setId === set.id.toString() &&
                          activeCell?.metric === 'restSec'
                        }
                        onPress={() =>
                          onOpenCell({
                            routineExerciseId: routineExercise.id.toString(),
                            setId: set.id.toString(),
                            metric: 'restSec',
                            value: getCellValue(set, 'restSec'),
                          })
                        }
                      />
                    </ERTable.Cell>
                  </ERTable.Row>
                ))}
              </ERTable.Body>
            </ERTable>
          }
        />
      )}
      ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
    />
  );
};

export default RoutineExerciseAccordionList;
export type { RoutineExerciseAccordionListProps };
