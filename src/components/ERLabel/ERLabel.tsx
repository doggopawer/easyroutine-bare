import React, { useMemo } from 'react';
import { Text, StyleSheet, TextStyle } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider/ThemeProvider';

type ERLabelProps = {
  label: string;
  required?: boolean;
  style?: TextStyle;
};

const ERLabel: React.FC<ERLabelProps> = ({ label, required = false, style }) => {
  const { theme } = useTheme();

  const labelStyle = useMemo<TextStyle>(
    () => ({
      color: theme.colors.text,
    }),
    [theme.colors.text]
  );

  const requiredStyle = useMemo<TextStyle>(
    () => ({
      color: theme.colors.red1,
    }),
    [theme.colors.red1]
  );

  return (
    <Text style={[styles.sectionLabel, labelStyle, style]}>
      {label} {required && <Text style={requiredStyle}>*</Text>}
    </Text>
  );
};

export default ERLabel;

const styles = StyleSheet.create({
  sectionLabel: {
    fontSize: 15,
    fontWeight: '900',
  },
});
