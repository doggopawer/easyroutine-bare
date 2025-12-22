// ChipTabItem.tsx
import React from 'react';
import styled from 'styled-components/native';
import Select, { useSelect } from '../headless/Select/Select';

type ChipTabItemProps = {
  value: string;
  label: string;
  onTabItemPress?: (value: string) => void;
  disabled?: boolean;
  accessibilityLabel?: string;
  // 웹 gap: 10px 대응용(마지막 아이템 제외)
  isLast?: boolean;
};

const ChipPressable = styled.View<{ $active: boolean; $disabled: boolean; $isLast: boolean }>`
  min-width: 50px;
  padding: 8px 10px;
  border-radius: 12px;

  border-width: 1px;
  border-color: ${({ $active, theme }) => ($active ? theme.colors.primary1 : theme.colors.gray4)};

  background-color: ${({ $active, theme }) => ($active ? theme.colors.primary1 : 'transparent')};

  opacity: ${({ $disabled }) => ($disabled ? 0.5 : 1)};

  align-items: center;
  justify-content: center;

  margin-right: ${({ $isLast }) => ($isLast ? 0 : 10)}px;
`;

const ChipText = styled.Text<{ $active: boolean }>`
  font-size: 14px;
  font-weight: ${({ $active }) => ($active ? 'bold' : 'regular')};
  color: ${({ $active, theme }) => ($active ? theme.colors.white1 : theme.colors.textMuted)};
`;

const ChipTabItem: React.FC<ChipTabItemProps> = ({
  value,
  label,
  onTabItemPress,
  disabled,
  accessibilityLabel,
  isLast = false,
}) => {
  const { isActive } = useSelect();
  const active = isActive(value);

  return (
    <Select.Item
      value={value}
      disabled={disabled}
      accessibilityLabel={accessibilityLabel ?? label}
      onPress={v => onTabItemPress?.(v)}
    >
      <ChipPressable $active={active} $disabled={!!disabled} $isLast={isLast}>
        <ChipText $active={active}>{label}</ChipText>
      </ChipPressable>
    </Select.Item>
  );
};

export default ChipTabItem;
