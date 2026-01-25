import React from 'react';
import PageLayout from '@/components/ui/PageLayout/PageLayout';
import { useHistoryDetailScreen } from '@/hooks/useHistoryDetailScreen';
import HistoryDetailContent from '@/components/domain/HistoryDetail/HistoryDetailContent';

const HistoryDetailScreen: React.FC = () => {
  const { recordId } = useHistoryDetailScreen();

  return (
    <PageLayout
      mode="stack"
      title="기록 상세"
      main={<HistoryDetailContent recordId={recordId} />}
    />
  );
};

export default HistoryDetailScreen;
