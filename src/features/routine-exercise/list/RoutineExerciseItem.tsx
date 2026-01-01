import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider/ThemeProvider';
import { Image } from 'react-native';

export type RoutineExerciseItemProps = {
  name: string;
  imageSrc: string;
  setCount: number;
};

const RoutineExerciseItem: React.FC<RoutineExerciseItemProps> = ({ name, imageSrc, setCount }) => {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <View style={[styles.iconBox, { backgroundColor: theme.colors.green2 }]}>
        <Image source={{ uri: imageSrc }} style={styles.image} resizeMode="cover" />
      </View>

      <View style={styles.textBox}>
        <Text style={[styles.title, { color: theme.colors.text }]}>{name}</Text>
        <Text style={[styles.count, { color: theme.colors.textMuted }]}>{setCount} 세트</Text>
      </View>
    </View>
  );
};

export default RoutineExerciseItem;

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

  image: {
    width: '100%',
    height: '100%',
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
