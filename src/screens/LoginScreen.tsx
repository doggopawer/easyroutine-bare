import React from 'react';
import PageLayout from '@/components/common/PageLayout/PageLayout';
import { useLoginContent } from '@/hooks/feature/useLoginContent';
import LoginContent from '@/components/feature/Login/LoginContent';

const LoginScreen: React.FC = () => {
  const { login } = useLoginContent();

  return (
    <PageLayout
      mode="stack"
      title="Login"
      showHeader={false}
      main={<LoginContent onLogin={login} />}
    />
  );
};

export default LoginScreen;
