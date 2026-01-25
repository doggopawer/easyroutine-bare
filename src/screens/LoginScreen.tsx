import React from 'react';
import PageLayout from '@/components/ui/PageLayout/PageLayout';
import { useLoginScreen } from '@/hooks/useLoginScreen';
import LoginContent from '@/components/domain/Login/LoginContent';

const LoginScreen: React.FC = () => {
  const { handleLogin } = useLoginScreen();

  return (
    <PageLayout
      mode="stack"
      title="Login"
      showHeader={false}
      main={<LoginContent onLogin={handleLogin} />}
    />
  );
};

export default LoginScreen;
