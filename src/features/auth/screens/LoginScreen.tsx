import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../../navigation/types';
import PageLayout from '@/components/Layout/PageLayout';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <PageLayout mode="stack" title="Login" showHeader={false}>
      <View style={styles.container}>
        <Text style={styles.text}>Login Screen</Text>
        <Button
          title="Login (Mock)"
          onPress={() => {
            console.log('Login pressed');
          }}
        />
      </View>
    </PageLayout>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 20, marginBottom: 20 },
});

export default LoginScreen;
