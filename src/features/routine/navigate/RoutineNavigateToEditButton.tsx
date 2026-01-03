import ERIconTextButton from '@/headful/ERIconTextButton';
import { useTheme } from '@/theme/ThemeProvider/ThemeProvider';
import React from 'react';
import FireIcon from '@/assets/images/fire.svg';

type RoutineNavigateToEditButtonProps = {
  routineId: string;
  onNavigateToEditPress: (routineId: string) => void;
};

const RoutineNavigateToEditButton = ({
  routineId,
  onNavigateToEditPress,
}: RoutineNavigateToEditButtonProps) => {
  const { theme } = useTheme();

  return (
    <ERIconTextButton
      color={theme.colors.gray3}
      icon={<FireIcon />}
      text="루틴 수정하기"
      onPress={() => onNavigateToEditPress(routineId)}
    />
  );
};

export default RoutineNavigateToEditButton;
