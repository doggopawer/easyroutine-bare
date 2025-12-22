// LineTabItem.tsx
import React from 'react';
import styled from 'styled-components/native';
import Select, { useSelect } from '@/components/headless/Select/Select';

type LineTabItemProps = {
  value: string;
  children: React.ReactNode;
  onTabItemPress?: (value: string) => void;
  disabled?: boolean;
  accessibilityLabel?: string;
};

const PressArea = styled.View<{ $active: boolean; $disabled: boolean }>`
  width: 100%;
  padding: 15px 0px;

  align-items: center;
  justify-content: center;

  border-bottom-width: 1px;
  border-bottom-color: ${({ $active, theme }) => ($active ? theme.colors.primary1 : 'transparent')};

  opacity: ${({ $disabled }) => ($disabled ? 0.5 : 1)};
`;

const Label = styled.Text<{ $active: boolean }>`
  font-size: 14px;
  font-weight: ${({ $active }) => ($active ? '700' : '400')};
  color: ${({ $active, theme }) => ($active ? theme.colors.primary1 : theme.colors.text)};
`;

const LineTabItem: React.FC<LineTabItemProps> = ({
  value,
  children,
  onTabItemPress,
  disabled,
  accessibilityLabel,
}) => {
  const { isActive } = useSelect();
  const active = isActive(value);

  return (
    <Select.Item
      value={value}
      disabled={disabled}
      accessibilityLabel={accessibilityLabel}
      onPress={v => onTabItemPress?.(v)}
      style={{ flex: 1 }}
    >
      <PressArea $active={active} $disabled={!!disabled}>
        {typeof children === 'string' ? <Label $active={active}>{children}</Label> : children}
      </PressArea>
    </Select.Item>
  );
};

export default LineTabItem;
