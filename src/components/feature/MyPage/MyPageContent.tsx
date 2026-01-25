import React from 'react';
import ERTab from '@/components/common/ERTab/ERTab';
import { VStack } from '@/components/common/VStack/VStack';
import BasicToggle from '@/components/common/BasicToggle/BasicToggle';
import CircleButton from '@/components/common/CircleButton/CircleButton';
import ProfileBox from '@/components/common/ProfileBox/ProfileBox';

type MyPageContentProps = {
  onToggleClick: () => void;
  onCircleButtonClick: () => void;
  onTabItemPress: (value: string) => void;
};

const MyPageContent: React.FC<MyPageContentProps> = ({
  onToggleClick,
  onCircleButtonClick,
  onTabItemPress,
}) => {
  return (
    <VStack>
      <BasicToggle onToggleClick={onToggleClick} defaultValue={false} />

      <CircleButton width={40} height={40} onCircleButtonClick={onCircleButtonClick}>
        d
      </CircleButton>

      <ERTab variant="color" defaultValue="VIOLET">
        <ERTab.Item value="VIOLET" onTabItemPress={onTabItemPress} />
        <ERTab.Item value="ORANGE" onTabItemPress={onTabItemPress} />
        <ERTab.Item value="GREEN" onTabItemPress={onTabItemPress} />
        <ERTab.Item value="BLUE" onTabItemPress={onTabItemPress} />
        <ERTab.Item value="PINK" onTabItemPress={onTabItemPress} />
      </ERTab>

      <ERTab variant="chip" defaultValue="ALL">
        <ERTab.Item value="ALL" label="전체" onTabItemPress={onTabItemPress} />
        <ERTab.Item value="A" label="A" onTabItemPress={onTabItemPress} />
        <ERTab.Item value="B" label="B" onTabItemPress={onTabItemPress} />
        <ERTab.Item value="C" label="C" onTabItemPress={onTabItemPress} isLast />
      </ERTab>

      <ERTab variant="line" defaultValue="A">
        <ERTab.Item value="A" onTabItemPress={onTabItemPress}>
          A
        </ERTab.Item>
        <ERTab.Item value="B" onTabItemPress={onTabItemPress}>
          B
        </ERTab.Item>
        <ERTab.Item value="C" onTabItemPress={onTabItemPress}>
          C
        </ERTab.Item>
      </ERTab>

      <ERTab variant="icon" defaultValue="A">
        <ERTab.Item value="A" onTabItemPress={onTabItemPress}>
          A
        </ERTab.Item>
        <ERTab.Item value="B" onTabItemPress={onTabItemPress}>
          B
        </ERTab.Item>
        <ERTab.Item value="C" onTabItemPress={onTabItemPress}>
          D
        </ERTab.Item>
      </ERTab>

      {Array.from({ length: 20 }).map((_, i) => (
        <ProfileBox key={i} imageSrc="https://picsum.photos/id/237/200/200" name="김동현" />
      ))}
    </VStack>
  );
};

export default MyPageContent;
export type { MyPageContentProps };
