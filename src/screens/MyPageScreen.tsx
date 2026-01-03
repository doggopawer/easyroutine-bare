import React from 'react';
import { Alert } from 'react-native';
import PageLayout from '@/components/PageLayout/PageLayout';

import ERTab from '@/components/ERTab/ERTab';

import { VStack } from '@/components/VStack/VStack';
import BasicToggle from '@/components/BasicToggle/BasicToggle';
import CircleButton from '@/components/CircleButton/CircleButton';
import ProfileBox from '@/components/ProfileBox/ProfileBox';

const MyPageScreen: React.FC = () => {
  return (
    <PageLayout
      mode="tab"
      activeTab="MyPage"
      overlay={({ scrollY }) => (
        <></>
        // <FloatingCircleButton scrollY={scrollY} onButtonClick={() => Alert.alert('FAB', 'click')} />
      )}
      main={
        <VStack>
          <BasicToggle onToggleClick={() => {}} defaultValue={false} />

          <CircleButton width={40} height={40} onCircleButtonClick={() => console.log('click')}>
            d
          </CircleButton>

          <ERTab variant="color" defaultValue="VIOLET">
            <ERTab.Item value="VIOLET" onTabItemPress={v => Alert.alert('click', v)} />
            <ERTab.Item value="ORANGE" onTabItemPress={v => Alert.alert('click', v)} />
            <ERTab.Item value="GREEN" onTabItemPress={v => Alert.alert('click', v)} />
            <ERTab.Item value="BLUE" onTabItemPress={v => Alert.alert('click', v)} />
            <ERTab.Item value="PINK" onTabItemPress={v => Alert.alert('click', v)} />
          </ERTab>

          <ERTab variant="chip" defaultValue="ALL">
            <ERTab.Item value="ALL" label="전체" onTabItemPress={v => Alert.alert('click', v)} />
            <ERTab.Item value="A" label="A" onTabItemPress={v => Alert.alert('click', v)} />
            <ERTab.Item value="B" label="B" onTabItemPress={v => Alert.alert('click', v)} />
            <ERTab.Item value="C" label="C" onTabItemPress={v => Alert.alert('click', v)} isLast />
          </ERTab>

          <ERTab variant="line" defaultValue="A">
            <ERTab.Item value="A" onTabItemPress={v => Alert.alert('click', v)}>
              A
            </ERTab.Item>
            <ERTab.Item value="B" onTabItemPress={v => Alert.alert('click', v)}>
              B
            </ERTab.Item>
            <ERTab.Item value="C" onTabItemPress={v => Alert.alert('click', v)}>
              C
            </ERTab.Item>
          </ERTab>

          <ERTab variant="icon" defaultValue="A">
            <ERTab.Item value="A" onTabItemPress={v => Alert.alert('click', v)}>
              A
            </ERTab.Item>
            <ERTab.Item value="B" onTabItemPress={v => Alert.alert('click', v)}>
              B
            </ERTab.Item>
            <ERTab.Item value="C" onTabItemPress={v => Alert.alert('click', v)}>
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
