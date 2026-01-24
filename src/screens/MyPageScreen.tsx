import React from 'react';
import PageLayout from '@/components/ui/PageLayout/PageLayout';

import ERTab from '@/components/ui/ERTab/ERTab';

import { VStack } from '@/components/ui/VStack/VStack';
import BasicToggle from '@/components/ui/BasicToggle/BasicToggle';
import CircleButton from '@/components/ui/CircleButton/CircleButton';
import ProfileBox from '@/components/ui/ProfileBox/ProfileBox';
import { useMyPageScreen } from '@/hooks/useMyPageScreen';

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
        <VStack>
          <BasicToggle onToggleClick={handleToggleClick} defaultValue={false} />

          <CircleButton width={40} height={40} onCircleButtonClick={handleCircleButtonClick}>
            d
          </CircleButton>

          <ERTab variant="color" defaultValue="VIOLET">
            <ERTab.Item value="VIOLET" onTabItemPress={handleTabItemPress} />
            <ERTab.Item value="ORANGE" onTabItemPress={handleTabItemPress} />
            <ERTab.Item value="GREEN" onTabItemPress={handleTabItemPress} />
            <ERTab.Item value="BLUE" onTabItemPress={handleTabItemPress} />
            <ERTab.Item value="PINK" onTabItemPress={handleTabItemPress} />
          </ERTab>

          <ERTab variant="chip" defaultValue="ALL">
            <ERTab.Item value="ALL" label="전체" onTabItemPress={handleTabItemPress} />
            <ERTab.Item value="A" label="A" onTabItemPress={handleTabItemPress} />
            <ERTab.Item value="B" label="B" onTabItemPress={handleTabItemPress} />
            <ERTab.Item value="C" label="C" onTabItemPress={handleTabItemPress} isLast />
          </ERTab>

          <ERTab variant="line" defaultValue="A">
            <ERTab.Item value="A" onTabItemPress={handleTabItemPress}>
              A
            </ERTab.Item>
            <ERTab.Item value="B" onTabItemPress={handleTabItemPress}>
              B
            </ERTab.Item>
            <ERTab.Item value="C" onTabItemPress={handleTabItemPress}>
              C
            </ERTab.Item>
          </ERTab>

          <ERTab variant="icon" defaultValue="A">
            <ERTab.Item value="A" onTabItemPress={handleTabItemPress}>
              A
            </ERTab.Item>
            <ERTab.Item value="B" onTabItemPress={handleTabItemPress}>
              B
            </ERTab.Item>
            <ERTab.Item value="C" onTabItemPress={handleTabItemPress}>
              D
            </ERTab.Item>
          </ERTab>

          {Array.from({ length: 20 }).map((_, i) => (
            <ProfileBox key={i} imageSrc="https://picsum.photos/id/237/200/200" name="김동현" />
          ))}
        </VStack>
      }
    />
  );
};

export default MyPageScreen;
