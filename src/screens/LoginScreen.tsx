import React from 'react';
import { Text, Button, StyleSheet } from 'react-native';
import PageLayout from '@/components/PageLayout/PageLayout';
import { useLoginScreen } from '@/hooks/useLoginScreen';

const LoginScreen: React.FC = () => {
  const { handleLogin } = useLoginScreen();

  return (
    <PageLayout
      mode="stack"
      title="Login"
      showHeader={false}
      main={
        <>
          <Text style={styles.text}>Login Screen</Text>
          <Button title="Login (Mock)" onPress={handleLogin} />
        </>
      }
    />
  );
};

const styles = StyleSheet.create({
  text: { fontSize: 20, marginBottom: 20 },
});

export default LoginScreen;
