// ColorTab.tsx
import React from 'react';
import styled from 'styled-components/native';
import ColorTabItem from './ColorTabItem';
import Select from '../headless/Select/Select';

type ColorTabProps = {
  defaultValue: string;
  children: React.ReactNode;
  value?: string;
  onChange?: (value: string) => void;
};

const Wrapper = styled.View`
  flex-direction: row;
  justify-content: space-between;
  width: 50%;
`;

type ColorTabComponent = React.FC<ColorTabProps> & {
  Item: typeof ColorTabItem;
};

const ColorTabRoot: React.FC<ColorTabProps> = ({ defaultValue, value, onChange, children }) => {
  return (
    <Select defaultValue={defaultValue} value={value} onChange={onChange}>
      <Wrapper>{children}</Wrapper>
    </Select>
  );
};

const ColorTab = ColorTabRoot as ColorTabComponent;
ColorTab.Item = ColorTabItem;

export default ColorTab;
