import ERFloatingActionButton from '@/headful/ERFloatingActionButton/ERFloatingActionButton';
import React from 'react';

type RoutineNavigateToCreateButtonProps = {
  scrollY: number;
  onNavigateToCreatePress: () => void;
};

const RoutineNavigateToCreateButton = ({
  scrollY,
  onNavigateToCreatePress,
}: RoutineNavigateToCreateButtonProps) => {
  return <ERFloatingActionButton scrollY={scrollY} onButtonClick={onNavigateToCreatePress} />;
};

export default RoutineNavigateToCreateButton;
