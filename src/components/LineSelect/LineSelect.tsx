// LineSelect.tsx
import React from 'react';
import styled from 'styled-components/native';
import Select from '@/components/headless/Select/Select';
import LineSelectItem from './LineSelectItem';

type LineSelectProps = {
  children: React.ReactNode;
  defaultValue?: string;
  value?: string;
  onChange?: (value: string) => void;
};

const Wrapper = styled.View`
  flex-direction: column;
  gap: 10px;
  height: 100%;
`;

type LineSelectComponent = React.FC<LineSelectProps> & {
  Item: typeof LineSelectItem;
};

const LineSelectRoot: React.FC<LineSelectProps> = ({ children, defaultValue, value, onChange }) => {
  return (
    <Select defaultValue={defaultValue} value={value} onChange={onChange}>
      <Wrapper>{children}</Wrapper>
    </Select>
  );
};

const LineSelect = LineSelectRoot as LineSelectComponent;
LineSelect.Item = LineSelectItem;

export default LineSelect;
