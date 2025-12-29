import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import FireIcon from '@/assets/images/fire.svg';
import { useTheme } from '@/theme/ThemeProvider/ThemeProvider';

const RoutineSummary = ({ title, countText }: { title: string; countText: string }) => {
  const { theme } = useTheme();

  return (
    <View style={styles.wrapper}>
      <View style={[styles.iconBox, { backgroundColor: theme.colors.green2 }]}>
        <FireIcon />
      </View>

      <View style={styles.textBox}>
        <Text style={[styles.title, { color: theme.colors.text }]}>{title}</Text>
        <Text style={[styles.count, { color: theme.colors.text }]}>{countText}</Text>
      </View>
    </View>
  );
};

export default RoutineSummary;

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    gap: 8,
  },

  iconBox: {
    width: 54,
    height: 54,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },

  iconText: {
    fontSize: 22,
  },

  textBox: {
    flex: 1,
    justifyContent: 'center',
  },

  title: {
    fontSize: 16,
    fontWeight: '700',
  },
  count: {
    fontSize: 14,
    fontWeight: '600',
  },
});
