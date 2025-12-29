import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider/ThemeProvider';
import FireIcon from '@/assets/images/fire.svg';

export type ExerciseItemData = {
  id: string;
  name: string;
  setCount: number;
};

export type ExerciseItemProps = {
  exercise: ExerciseItemData;
};

const ExerciseItem: React.FC<ExerciseItemProps> = ({ exercise }) => {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <View style={[styles.iconBox, { backgroundColor: theme.colors.green2 }]}>
        <FireIcon />
      </View>

      <View style={styles.textBox}>
        <Text style={[styles.title, { color: theme.colors.text }]}>{exercise.name}</Text>
        <Text style={[styles.count, { color: theme.colors.textMuted }]}>
          {exercise.setCount} 세트
        </Text>
      </View>
    </View>
  );
};

export default ExerciseItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },

  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },

  textBox: {
    flex: 1,
    justifyContent: 'center',
  },

  title: {
    fontSize: 13,
    fontWeight: '700',
  },

  count: {
    marginTop: 2,
    fontSize: 13,
    fontWeight: '500',
  },
});
