// LineTab.tsx
import React from 'react';
import styled from 'styled-components/native';
import Select from '@/components/headless/Select/Select';
import LineTabItem from './LineTabItem';

type LineTabProps = {
  defaultValue: string;
  children: React.ReactNode;
  value?: string;
  onChange?: (value: string) => void;
};

const Wrapper = styled.View`
  flex-direction: row;
  width: 100%;
`;

type LineTabComponent = React.FC<LineTabProps> & {
  Item: typeof LineTabItem;
};

const LineTabRoot: React.FC<LineTabProps> = ({ defaultValue, value, onChange, children }) => {
  return (
    <Select defaultValue={defaultValue} value={value} onChange={onChange}>
      <Wrapper>{children}</Wrapper>
    </Select>
  );
};

const LineTab = LineTabRoot as LineTabComponent;
LineTab.Item = LineTabItem;

export default LineTab;
