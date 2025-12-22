import React from 'react';
import { Alert } from 'react-native';
import PageLayout from '@/components/Layout/PageLayout';
import BasicToggle from '@/components/BasicToggle';
import CircleButton from '@/components/CircleButton';
import ColorTab from '@/components/ColorTab/ColorTab';
import ChipTab from '@/components/ChipTab/ChipTab';
import LineTab from '@/components/LineTab/LineTab';
import IconTab from '@/components/IconTab/IconTab';
import ProfileBox from '@/components/ProfileBox/ProfileBox';
import FloatingCircleButton from '@/components/FloatingCircleButton/FloatingCircleButton';
import { VStack } from '@/shared/layout';

const MyPageScreen: React.FC = () => {
  return (
    <PageLayout
      mode="tab"
      activeTab="MyPage"
      overlay={({ scrollY }) => (
        <FloatingCircleButton scrollY={scrollY} onButtonClick={() => Alert.alert('FAB', 'click')} />
      )}
    >
      <VStack>
        <BasicToggle onToggleClick={() => {}} defaultValue={false} />

        <CircleButton width={40} height={40} onCircleButtonClick={() => console.log('click')}>
          d
        </CircleButton>

        <ColorTab defaultValue="VIOLET">
          <ColorTab.Item value="VIOLET" onTabItemPress={v => Alert.alert('click', v)} />
          <ColorTab.Item value="ORANGE" onTabItemPress={v => Alert.alert('click', v)} />
          <ColorTab.Item value="GREEN" onTabItemPress={v => Alert.alert('click', v)} />
          <ColorTab.Item value="BLUE" onTabItemPress={v => Alert.alert('click', v)} />
          <ColorTab.Item value="PINK" onTabItemPress={v => Alert.alert('click', v)} />
        </ColorTab>

        <ChipTab defaultValue="ALL">
          <ChipTab.Item value="ALL" label="전체" onTabItemPress={v => Alert.alert('click', v)} />
          <ChipTab.Item value="A" label="A" onTabItemPress={v => Alert.alert('click', v)} />
          <ChipTab.Item value="B" label="B" onTabItemPress={v => Alert.alert('click', v)} />
          <ChipTab.Item value="C" label="C" onTabItemPress={v => Alert.alert('click', v)} isLast />
        </ChipTab>

        <LineTab defaultValue="A">
          <LineTab.Item value="A" onTabItemPress={v => Alert.alert('click', v)}>
            A
          </LineTab.Item>
          <LineTab.Item value="B" onTabItemPress={v => Alert.alert('click', v)}>
            B
          </LineTab.Item>
          <LineTab.Item value="C" onTabItemPress={v => Alert.alert('click', v)}>
            C
          </LineTab.Item>
        </LineTab>

        <IconTab defaultValue="A">
          <IconTab.Item value="A" onTabItemPress={v => Alert.alert('click', v)}>
            A
          </IconTab.Item>
          <IconTab.Item value="B" onTabItemPress={v => Alert.alert('click', v)}>
            B
          </IconTab.Item>
          <IconTab.Item value="C" onTabItemPress={v => Alert.alert('click', v)}>
            D
          </IconTab.Item>
        </IconTab>

        {Array.from({ length: 20 }).map((_, i) => (
          <ProfileBox key={i} imageSrc="https://picsum.photos/id/237/200/200" name="김동현" />
        ))}
      </VStack>
    </PageLayout>
  );
};

export default MyPageScreen;
