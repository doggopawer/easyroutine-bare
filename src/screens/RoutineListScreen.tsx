import React from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RoutineStackParamList } from '@/navigation/types';
import ERFloatingActionButton from '@/components/common/ERFloatingActionButton/ERFloatingActionButton';
import { useTheme } from '@/theme/ThemeProvider/ThemeProvider';
import PageLayout from '@/components/common/PageLayout/PageLayout';
import { useRoutineListContent } from '@/hooks/feature/useRoutineListContent';
import { useRoutineDeleteModal } from '@/hooks/feature/useRoutineDeleteModal';
import RoutineDeleteModal from '@/components/feature/RoutineDeleteModal/RoutineDeleteModal';
import RoutineListContent from '@/components/feature/RoutineList/RoutineListContent';

type Props = NativeStackScreenProps<RoutineStackParamList, 'RoutineList'>;

const RoutineListScreen: React.FC<Props> = ({ navigation }) => {
  const { theme } = useTheme();

  const { routineList } = useRoutineListContent();

  const { modalProps: routineDeleteModalProps, openDeleteModal } = useRoutineDeleteModal();

  return (
    <PageLayout
      mode="tab"
      activeTab="Home"
      overlay={({ scrollY }) => (
        <>
          <RoutineDeleteModal
            {...routineDeleteModalProps}
            accentColor={theme.colors.red1}
          />

          <ERFloatingActionButton
            scrollY={scrollY}
            onButtonClick={() => navigation.navigate('RoutineCreate')}
          />
        </>
      )}
      main={
        <RoutineListContent
          routineList={routineList}
          onDeletePress={openDeleteModal}
          onEditPress={item =>
            navigation.navigate('RoutineEdit', {
              routineId: item.id.toString(),
              routine: item,
            })
          }
          onStartPress={item =>
            navigation.navigate('RoutineProgress', {
              routineId: item.id.toString(),
              routine: item,
            })
          }
        />
      }
    />
  );
};

export default RoutineListScreen;
