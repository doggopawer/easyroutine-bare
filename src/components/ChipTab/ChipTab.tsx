// ChipTab.tsx
import React from 'react';
import styled from 'styled-components/native';
import Select from '@/components/headless/Select/Select';
import ChipTabItem from './ChipTabItem';

type ChipTabProps = {
  defaultValue: string;
  children: React.ReactNode;
  value?: string;
  onChange?: (value: string) => void;
};

const Scroll = styled.ScrollView.attrs(() => ({
  horizontal: true,
  showsHorizontalScrollIndicator: false,
  contentContainerStyle: {
    // RN에서 web의 gap: 10px 대응
    // (가장 호환성 좋은 방식은 Item에 marginRight 주는 것이라 Item쪽에서 처리할게)
  },
}))`
  width: 100%;
  min-height: 32px;
`;

const Row = styled.View`
  flex-direction: row;
  align-items: center;
`;

type ChipTabComponent = React.FC<ChipTabProps> & {
  Item: typeof ChipTabItem;
};

const ChipTabRoot: React.FC<ChipTabProps> = ({ defaultValue, value, onChange, children }) => {
  return (
    <Select defaultValue={defaultValue} value={value} onChange={onChange}>
      <Scroll>
        <Row>{children}</Row>
      </Scroll>
    </Select>
  );
};

const ChipTab = ChipTabRoot as ChipTabComponent;
ChipTab.Item = ChipTabItem;

export default ChipTab;
