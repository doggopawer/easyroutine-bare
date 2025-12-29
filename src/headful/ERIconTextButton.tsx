import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Pressable } from 'react-native';

type ERIconTextButtonProps = {
  color: string;
  icon: React.ReactNode;
  text: string;
  onPress: () => void;
};

const ERIconTextButton = ({ icon, text, onPress }: ERIconTextButtonProps) => {
  return (
    <Pressable style={styles.container} onPress={onPress}>
      {icon}
      <Text>{text}</Text>
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
});
