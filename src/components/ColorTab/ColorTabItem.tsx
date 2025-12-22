// ColorTabItem.tsx
import React, { useMemo } from 'react';
import styled from 'styled-components/native';
import Select, { useSelect } from '../headless/Select/Select';

type ColorTabItemProps = {
  value: string;
  onTabItemPress?: (value: string) => void;
  disabled?: boolean;
  accessibilityLabel?: string;
};

const Dot = styled.View<{ $bg: string; $active: boolean }>`
  width: 25px;
  height: 25px;
  border-radius: 999px;

  background-color: ${({ $bg }) => $bg};

  border-width: ${({ $active }) => ($active ? 5 : 0)}px;
  border-color: ${({ theme }) => theme.colors.primary};
`;

const ColorTabItem: React.FC<ColorTabItemProps> = ({
  value,
  onTabItemPress,
  disabled,
  accessibilityLabel,
}) => {
  const { isActive } = useSelect();
  const active = isActive(value);

  const bgColor = useMemo(() => {
    switch (value) {
      case 'VIOLET':
        return '#855cf8';
      case 'ORANGE':
        return '#f26b2c';
      case 'GREEN':
        return '#2daf2d';
      case 'BLUE':
        return '#455a64';
      case 'PINK':
        return '#dd408f';
      default:
        return '#999999';
    }
  }, [value]);

  return (
    <Select.Item
      value={value}
      disabled={disabled}
      accessibilityLabel={accessibilityLabel}
      onPress={v => onTabItemPress?.(v)}
    >
      <Dot $bg={bgColor} $active={active} />
    </Select.Item>
  );
};

export default ColorTabItem;
