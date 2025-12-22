// IconTab.tsx
import React from 'react';
import styled from 'styled-components/native';
import Select from '@/components/headless/Select/Select';
import IconTabItem from './IconTabItem';

type IconTabProps = {
  defaultValue: string;
  children: React.ReactNode;
  value?: string;
  onChange?: (value: string) => void;
};

const Wrapper = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: space-between;

  /* 탭 영역이 눈에 띄도록 최소 높이/여백 */
  min-height: 52px;
  padding: 8px 0px;
`;

type IconTabComponent = React.FC<IconTabProps> & {
  Item: typeof IconTabItem;
};

const IconTabRoot: React.FC<IconTabProps> = ({ defaultValue, value, onChange, children }) => {
  return (
    <Select defaultValue={defaultValue} value={value} onChange={onChange}>
      <Wrapper>{children}</Wrapper>
    </Select>
  );
};

const IconTab = IconTabRoot as IconTabComponent;
IconTab.Item = IconTabItem;

export default IconTab;
