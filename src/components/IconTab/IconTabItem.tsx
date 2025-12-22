// IconTabItem.tsx
import React from 'react';
import styled from 'styled-components/native';
import Select, { useSelect } from '@/components/headless/Select/Select';

type IconTabItemProps = {
  value: string;
  children: React.ReactNode;
  onTabItemPress?: (value: string) => void;
  disabled?: boolean;
  accessibilityLabel?: string;
};

const Column = styled.View<{ $disabled: boolean }>`
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  opacity: ${({ $disabled }) => ($disabled ? 0.5 : 1)};
`;

const Content = styled.Text<{ $active: boolean }>`
  font-size: 14px;
  font-weight: ${({ $active }) => ($active ? '700' : '400')};

  /* ✅ 비활성은 gray3(더 진하게), 활성은 primary1 */
  color: ${({ $active, theme }) => ($active ? theme.colors.primary1 : theme.colors.gray3)};
`;

const IconTabItem: React.FC<IconTabItemProps> = ({
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
      <Column $disabled={!!disabled}>
        {typeof children === 'string' ? <Content $active={active}>{children}</Content> : children}
      </Column>
    </Select.Item>
  );
};

export default IconTabItem;
