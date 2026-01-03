import ERIconTextButton from '@/headful/ERIconTextButton';
import { useTheme } from '@/theme/ThemeProvider/ThemeProvider';
import React from 'react';
import FireIcon from '@/assets/images/fire.svg';

type RoutineNavigateToStartButtonProps = {
  routineId: string;
  onNavigateToStartPress: (routineId: string) => void;
};

const RoutineNavigateToStartButton = ({
  routineId,
  onNavigateToStartPress,
}: RoutineNavigateToStartButtonProps) => {
  const { theme } = useTheme();

  return (
    <ERIconTextButton
      color={theme.colors.primary1}
      icon={<FireIcon />}
      text="루틴 시작하기"
      onPress={() => onNavigateToStartPress(routineId)}
    />
  );
};

export default RoutineNavigateToStartButton;
