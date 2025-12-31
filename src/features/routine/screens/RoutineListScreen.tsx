import React, { useRef, useState, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RoutineStackParamList } from '../../../navigation/types';
import PageLayout from '@/components/Layout/PageLayout';
import FireIcon from '@/assets/images/fire.svg';
import ERSwipeableAccordion from '@/headful/ERSwipeableAccordion';
import RoutineSummary from '../components/RoutineSummary';
import ExerciseItem from '@/features/exercise/ExerciseItem';
import { HStack, VStack } from '@/shared/layout';
import ERIconTextButton from '@/headful/ERIconTextButton';
import ExerciseSummary from '@/features/exercise/ExerciseSummary';
import ERTable from '@/headful/ERTable/ERTable';
import ERBottomSheet, { ERBottomSheetRef } from '@/headful/ERBottomSheet/ERBottomSheet';
import ERIntegerKeypad from '@/headful/ERKeyPad/ERIntegerKeypad';
import ERDecimalKeypad from '@/headful/ERKeyPad/ERDecimalKeypad';
import ERDurationKeypad from '@/headful/ERKeyPad/ERDurationKeypad';

/* -------------------------------------------------------------------------- */
/*                                ✅ 타입 정의                                  */
/* -------------------------------------------------------------------------- */

export type MetricType = 'weight' | 'count' | 'time' | 'rest';
export type InputKind = 'decimal' | 'integer' | 'duration';

export const getInputKind = (type: MetricType): InputKind => {
  if (type === 'weight') return 'decimal';
  if (type === 'count') return 'integer';
  return 'duration';
};

type ActiveCell = {
  rowId: string;
  type: MetricType;
  value: string;
};

type Props = NativeStackScreenProps<RoutineStackParamList, 'RoutineList'>;

const RoutineListScreen: React.FC<Props> = ({ navigation }) => {
  const sheetRef = useRef<ERBottomSheetRef>(null);

  /* -------------------------------------------------------------------------- */
  /*                               ✅ 현재 선택된 셀                               */
  /* -------------------------------------------------------------------------- */

  const [activeCell, setActiveCell] = useState<ActiveCell | null>(null);

  /* -------------------------------------------------------------------------- */
  /*                             ✅ 활성 셀 타입 기반 inputKind                    */
  /* -------------------------------------------------------------------------- */

  const inputKind = useMemo(() => {
    if (!activeCell) return null;
    return getInputKind(activeCell.type);
  }, [activeCell]);

  /* -------------------------------------------------------------------------- */
  /*                             ✅ 셀 클릭 시 바텀시트 열기                          */
  /* -------------------------------------------------------------------------- */

  const openSheet = useCallback((cell: ActiveCell) => {
    setActiveCell(cell);
    sheetRef.current?.open();
  }, []);

  /* -------------------------------------------------------------------------- */
  /*                             ✅ 바텀시트 닫힐 때 상태 초기화                       */
  /* -------------------------------------------------------------------------- */

  const handleSheetClose = useCallback(() => {
    setActiveCell(null);
  }, []);

  return (
    <PageLayout
      mode="tab"
      activeTab="Home"
      overlay={() => (
        <ERBottomSheet ref={sheetRef} snapPoints={['45%']}>
          {inputKind === 'integer' && (
            <ERIntegerKeypad
              defaultValue={activeCell?.value ?? ''}
              onCancel={() => sheetRef.current?.close()}
              onConfirm={next => {
                console.log('integer confirm', next);
                sheetRef.current?.close();
              }}
            />
          )}

          {inputKind === 'decimal' && (
            <ERDecimalKeypad
              defaultValue={activeCell?.value ?? ''}
              onCancel={() => sheetRef.current?.close()}
              onConfirm={next => {
                console.log('decimal confirm', next);
                sheetRef.current?.close();
              }}
            />
          )}

          {inputKind === 'duration' && (
            <ERDurationKeypad
              defaultValue={activeCell?.value ?? ''}
              onCancel={() => sheetRef.current?.close()}
              onConfirm={next => {
                console.log('duration confirm', next);
                sheetRef.current?.close();
              }}
            />
          )}
        </ERBottomSheet>
      )}
    >
      <View style={styles.container}>
        <Pressable
          style={{ padding: 16, backgroundColor: '#eee', borderRadius: 12 }}
          onPress={() =>
            openSheet({
              rowId: 'debug',
              type: 'weight',
              value: '10',
            })
          }
        >
          <Text>바텀시트 테스트 열기</Text>
        </Pressable>

        <ERSwipeableAccordion
          visible={<RoutineSummary title="title" countText="countText" />}
          hidden={
            <VStack gap={12}>
              <FlatList
                data={[
                  { id: '1', name: 'Exercise 1', setCount: 3 },
                  { id: '2', name: 'Exercise 2', setCount: 2 },
                ]}
                keyExtractor={item => item.id}
                renderItem={({ item }) => <ExerciseItem exercise={item} />}
                ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                scrollEnabled={false}
              />

              <HStack justify="space-around">
                <ERIconTextButton
                  icon={<FireIcon />}
                  color="black"
                  text="Add Exercise"
                  onPress={() => {}}
                />
                <ERIconTextButton
                  icon={<FireIcon />}
                  color="red"
                  text="Add Exercise"
                  onPress={() => {}}
                />
              </HStack>
            </VStack>
          }
        />

        <ERSwipeableAccordion
          visible={
            <ExerciseSummary
              imageSrc="https://picsum.photos/id/237/200/200"
              title="운동"
              countText="countText"
              progress={1}
            />
          }
          hidden={
            <ERTable>
              <ERTable.Header>
                <ERTable.Cell width={50}>
                  <Text>세트</Text>
                </ERTable.Cell>
                <ERTable.Cell>
                  <Text>KG</Text>
                </ERTable.Cell>
                <ERTable.Cell>
                  <Text>횟수</Text>
                </ERTable.Cell>
                <ERTable.Cell>
                  <Text>시간</Text>
                </ERTable.Cell>
                <ERTable.Cell>
                  <Text>휴식</Text>
                </ERTable.Cell>
              </ERTable.Header>

              <ERTable.Body>
                {[1, 2, 3].map(i => (
                  <ERTable.Row variant={i === 1 ? 'active' : 'default'} key={i}>
                    <ERTable.Cell width={50}>
                      <ERTable.Input value={i.toString()} />
                    </ERTable.Cell>

                    <ERTable.Cell>
                      <ERTable.Input
                        value="10"
                        isActive={activeCell?.rowId === String(i) && activeCell?.type === 'weight'}
                        onPress={() =>
                          openSheet({
                            rowId: String(i),
                            type: 'weight',
                            value: '10',
                          })
                        }
                      />
                    </ERTable.Cell>

                    <ERTable.Cell>
                      <ERTable.Input
                        value="10"
                        isActive={activeCell?.rowId === String(i) && activeCell?.type === 'count'}
                        onPress={() =>
                          openSheet({
                            rowId: String(i),
                            type: 'count',
                            value: '10',
                          })
                        }
                      />
                    </ERTable.Cell>

                    <ERTable.Cell>
                      <ERTable.Input
                        value="05:30"
                        isActive={activeCell?.rowId === String(i) && activeCell?.type === 'time'}
                        onPress={() =>
                          openSheet({
                            rowId: String(i),
                            type: 'time',
                            value: '05:30',
                          })
                        }
                      />
                    </ERTable.Cell>

                    <ERTable.Cell>
                      <ERTable.Input
                        value="01:00"
                        isActive={activeCell?.rowId === String(i) && activeCell?.type === 'rest'}
                        onPress={() =>
                          openSheet({
                            rowId: String(i),
                            type: 'rest',
                            value: '01:00',
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
      </View>
    </PageLayout>
  );
};

export default RoutineListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 16,
  },
});
