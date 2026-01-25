import React from 'react';
import PageLayout from '@/components/common/PageLayout/PageLayout';
import { useStatisticsContent } from '@/hooks/feature/useStatisticsContent';
import StatisticsContent from '@/components/feature/Statistics/StatisticsContent';

const StatisticsScreen: React.FC = () => {
  useStatisticsContent();

  return (
    <PageLayout
      mode="tab"
      activeTab="History"
      main={<StatisticsContent />}
    />
  );
};

export default StatisticsScreen;
