// LineSelectItem.tsx
import React from 'react';
import styled from 'styled-components/native';
import Select, { useSelect } from '@/components/headless/Select/Select';
import Ionicons from 'react-native-vector-icons/Ionicons';

type LineSelectItemProps = {
  value: string;
  children: React.ReactNode;
  disabled?: boolean;
};

const Row = styled.View<{ $active: boolean; $disabled: boolean }>`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  padding: 14px 0px;

  opacity: ${({ $disabled }) => ($disabled ? 0.5 : 1)};
`;

const Label = styled.Text<{ $active: boolean }>`
  font-size: 14px;
  color: ${({ $active, theme }) => ($active ? theme.colors.primary1 : theme.colors.text)};
  font-weight: ${({ $active }) => ($active ? '600' : '400')};
`;

// const Check = styled.Text<{ $active: boolean }>`
//   font-size: 16px;
//   color: ${({ $active, theme }) => ($active ? theme.colors.primary1 : 'transparent')};
// `;

const LineSelectItem: React.FC<LineSelectItemProps> = ({ value, children, disabled }) => {
  const { isActive } = useSelect();
  const active = isActive(value);

  return (
    <Select.Item value={value} disabled={disabled} style={{ width: '100%' }}>
      <Row $active={active} $disabled={!!disabled}>
        {typeof children === 'string' ? <Label $active={active}>{children}</Label> : children}
        <Ionicons name="checkmark" size={20} color={active ? 'black' : 'transparent'} />
        {/* <Check $active={active}>✓</Check> */}
      </Row>
    </Select.Item>
  );
};

export default LineSelectItem;
