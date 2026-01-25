import React from 'react';
import { Text, Button, StyleSheet } from 'react-native';

type LoginContentProps = {
  onLogin: () => void;
};

const LoginContent: React.FC<LoginContentProps> = ({ onLogin }) => {
  return (
    <>
      <Text style={styles.text}>Login Screen</Text>
      <Button title="Login (Mock)" onPress={onLogin} />
    </>
  );
};

export default LoginContent;
export type { LoginContentProps };

const styles = StyleSheet.create({
  text: {
    fontSize: 20,
    marginBottom: 20,
  },
});
