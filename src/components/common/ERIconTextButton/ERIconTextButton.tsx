import React, { useMemo } from 'react';
import { StyleSheet, Text, Pressable, View } from 'react-native';

type ERIconTextButtonProps = {
  color: string;
  icon: React.ReactElement; // ✅ ReactNode -> ReactElement
  text: string;
  onPress: () => void;
};

const ERIconTextButton: React.FC<ERIconTextButtonProps> = ({ icon, text, onPress, color }) => {
  const coloredIcon = useMemo(() => {
    return React.cloneElement(icon, {
      color, // ✅ Ionicons 같은 경우
      fill: color, // ✅ SVG 같은 경우
    });
  }, [icon, color]);

  return (
    <Pressable style={styles.container} onPress={onPress}>
      {coloredIcon}
      <Text style={[styles.text, { color }]}>{text}</Text>
    </Pressable>
  );
};

export default ERIconTextButton;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  text: {
    fontSize: 14,
    fontWeight: '700',
  },
});
