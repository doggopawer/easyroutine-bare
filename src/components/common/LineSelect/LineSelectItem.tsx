// LineSelectItem.tsx
import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import Select, { useSelect } from '@/headless/Select/SelectItem';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '@/theme/ThemeProvider/ThemeProvider';

type LineSelectItemProps = {
  value: string;
  children: React.ReactNode;
  disabled?: boolean;
};

const LineSelectItem: React.FC<LineSelectItemProps> = ({ value, children, disabled }) => {
  const { isActive } = useSelect();
  const active = isActive(value);
  const { theme } = useTheme();

  const rowStyle: ViewStyle = {
    opacity: disabled ? 0.5 : 1,
  };

  return (
    <Select.Item value={value} disabled={disabled} style={{ width: '100%' }}>
      <View style={[styles.row, rowStyle]}>
        {typeof children === 'string' ? (
          <Text
            style={[
              styles.label,
              {
                fontWeight: active ? '600' : '400',
                color: active ? theme.colors.primary1 : theme.colors.text,
              },
            ]}
          >
            {children}
          </Text>
        ) : (
          children
        )}
        <Ionicons name="checkmark" size={20} color={active ? 'black' : 'transparent'} />
      </View>
    </Select.Item>
  );
};

export default LineSelectItem;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
  },
  label: {
    fontSize: 14,
  },
});
