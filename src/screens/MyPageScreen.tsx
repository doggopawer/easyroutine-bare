import React from 'react';
import PageLayout from '@/components/ui/PageLayout/PageLayout';
import { useMyPageScreen } from '@/hooks/useMyPageScreen';
import MyPageContent from '@/components/domain/MyPage/MyPageContent';

const MyPageScreen: React.FC = () => {
  const { handleToggleClick, handleCircleButtonClick, handleTabItemPress } = useMyPageScreen();

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
          onToggleClick={handleToggleClick}
          onCircleButtonClick={handleCircleButtonClick}
          onTabItemPress={handleTabItemPress}
        />
      }
    />
  );
};

export default MyPageScreen;
