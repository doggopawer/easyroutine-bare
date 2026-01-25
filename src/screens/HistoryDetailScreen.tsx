import React from 'react';
import PageLayout from '@/components/common/PageLayout/PageLayout';
import { useHistoryDetailContent } from '@/hooks/feature/useHistoryDetailContent';
import HistoryDetailContent from '@/components/feature/HistoryDetail/HistoryDetailContent';

const HistoryDetailScreen: React.FC = () => {
  const { recordId } = useHistoryDetailContent();

  return (
    <PageLayout
      mode="stack"
      title="기록 상세"
      main={<HistoryDetailContent recordId={recordId} />}
    />
  );
};

export default HistoryDetailScreen;
