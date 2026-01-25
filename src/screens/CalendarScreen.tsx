import React from 'react';
import PageLayout from '@/components/common/PageLayout/PageLayout';
import { useCalendarContent } from '@/hooks/feature/useCalendarContent';
import CalendarContent from '@/components/feature/Calendar/CalendarContent';

const CalendarScreen: React.FC = () => {
  const { highlightIndex, setHighlightIndex, navigateToDetail } = useCalendarContent();

  return (
    <PageLayout
      mode="tab"
      activeTab="History"
      scrollable
      main={
        <CalendarContent
          highlightIndex={highlightIndex}
          onHighlightChange={setHighlightIndex}
          onNavigateToDetail={navigateToDetail}
        />
      }
    />
  );
};

export default CalendarScreen;
