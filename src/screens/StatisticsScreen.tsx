import React from 'react';
import PageLayout from '@/components/ui/PageLayout/PageLayout';
import { useStatisticsScreen } from '@/hooks/useStatisticsScreen';
import StatisticsContent from '@/components/domain/Statistics/StatisticsContent';

const StatisticsScreen: React.FC = () => {
  useStatisticsScreen();

  return (
    <PageLayout
      mode="tab"
      activeTab="History"
      main={<StatisticsContent />}
    />
  );
};

export default StatisticsScreen;
