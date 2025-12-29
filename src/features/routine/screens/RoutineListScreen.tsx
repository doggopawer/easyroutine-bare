import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RoutineStackParamList } from '../../../navigation/types';
import PageLayout from '@/components/Layout/PageLayout';
import FireIcon from '@/assets/images/fire.svg';
import ERSwipeableAccordion from '@/headful/ERSwipeableAccordion/ERSwipeableAccordion';
import RoutineSummary from '../components/RoutineSummary';
import ExerciseItem from '@/features/exercise/ExerciseItem';
import { HStack, VStack } from '@/shared/layout';
import ERIconTextButton from '@/headful/ERIconTextButton';

type Props = NativeStackScreenProps<RoutineStackParamList, 'RoutineList'>;

const RoutineListScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <PageLayout mode="tab" activeTab="Home">
      <View style={styles.container}>
        {/* <Accordion defaultOpen={false}>
          <Accordion.Visible>
            <Accordion.Trigger>
              <Text>눌러서 열기</Text>
            </Accordion.Trigger>
          </Accordion.Visible>

          <Accordion.Content>
            <Text>열렸을 때만 보이는 내용</Text>
          </Accordion.Content>
        </Accordion> */}

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
                renderItem={({ item }) => (
                  // <View style={styles.exerciseRow}>
                  <ExerciseItem exercise={item} />
                  // </View>
                )}
                ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                scrollEnabled={false} // ✅ 아코디언 안에서는 보통 스크롤 끔 (부모 ScrollView에 맡김)
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
          onTriggerPress={() => {
            console.log('trigger pressed');
          }}
          onDeletePress={() => {
            console.log('delete pressed');
          }}
        />
      </View>
    </PageLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },

  card: {
    paddingVertical: 22,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },

  text: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default RoutineListScreen;
