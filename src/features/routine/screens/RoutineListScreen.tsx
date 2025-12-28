import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RoutineStackParamList } from '../../../navigation/types';
import PageLayout from '@/components/Layout/PageLayout';

import Accordion from '@/headless/Accordion/Accordion';
import Swipeable from '@/headless/Swipeable/Swipeable';
import RoutineCard from '@/components/RoutineCard/RoutineCard';

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

        <RoutineCard title="가슴운동 루틴" countText="5종목" />
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
