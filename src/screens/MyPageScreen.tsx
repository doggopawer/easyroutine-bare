import React from 'react';
import PageLayout from '@/components/common/PageLayout/PageLayout';
import { useMyPageContent } from '@/hooks/feature/useMyPageContent';
import MyPageContent from '@/components/feature/MyPage/MyPageContent';

const MyPageScreen: React.FC = () => {
  const { toggle, pressCircleButton, pressTabItem } = useMyPageContent();

  return (
    <PageLayout
      mode="tab"
      activeTab="MyPage"
      overlay={() => (
        <></>
        // <FloatingCircleButton scrollY={scrollY} onButtonClick={() => Alert.alert('FAB', 'click')} />
      )}
      main={
        <MyPageContent
          onToggleClick={toggle}
          onCircleButtonClick={pressCircleButton}
          onTabItemPress={pressTabItem}
        />
      }
    />
  );
};

export default MyPageScreen;
