import React from 'react';
import PageLayout from '@/components/ui/PageLayout/PageLayout';
import { useCalendarScreen } from '@/hooks/useCalendarScreen';
import CalendarContent from '@/components/domain/Calendar/CalendarContent';

const CalendarScreen: React.FC = () => {
  const { highlightIndex, setHighlightIndex, handleNavigateToDetail } = useCalendarScreen();

  return (
    <PageLayout
      mode="tab"
      activeTab="History"
      scrollable
      main={
        <CalendarContent
          highlightIndex={highlightIndex}
          onHighlightChange={setHighlightIndex}
          onNavigateToDetail={handleNavigateToDetail}
        />
      }
    />
  );
};

export default CalendarScreen;
