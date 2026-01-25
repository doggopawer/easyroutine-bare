import React from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RoutineStackParamList } from '@/navigation/types';
import ERFloatingActionButton from '@/components/ui/ERFloatingActionButton/ERFloatingActionButton';
import { useTheme } from '@/theme/ThemeProvider/ThemeProvider';
import PageLayout from '@/components/ui/PageLayout/PageLayout';
import { useRoutineListScreen } from '@/hooks/useRoutineListScreen';
import { useRoutineDeleteModal } from '@/hooks/useRoutineDeleteModal';
import RoutineDeleteModal from '@/components/domain/RoutineDeleteModal/RoutineDeleteModal';
import RoutineListContent from '@/components/domain/RoutineList/RoutineListContent';

type Props = NativeStackScreenProps<RoutineStackParamList, 'RoutineList'>;

const RoutineListScreen: React.FC<Props> = ({ navigation }) => {
  const { theme } = useTheme();

  const {
    routineList,
    handleDeleteRoutine,
  } = useRoutineListScreen();

  const { modalProps: routineDeleteModalProps, openDeleteModal } = useRoutineDeleteModal({
    onConfirmDelete: handleDeleteRoutine,
  });

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
