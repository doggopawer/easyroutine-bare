// App.tsx
// 기능: SafeArea/ThemeProvider 유지 + Recoil/ReactQuery 추가 + AuthStack/AppStack 분기
import React from 'react';
import { StatusBar } from 'react-native';
import {
  SafeAreaProvider,
} from 'react-native-safe-area-context';
import { enableScreens } from 'react-native-screens';
import { RecoilRoot } from 'recoil';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, useTheme } from './src/theme/ThemeProvider/ThemeProvider';
import AppNavigator from './src/navigation/AppNavigator';

// screens 최적화(앱 시작 1회)
enableScreens();

// --- App 엔트리: Provider + ThemeProvider + NavigationContainer ---
const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <RecoilRoot>
          <QueryClientProvider client={queryClient}>
            <ThemedRoot />
          </QueryClientProvider>
        </RecoilRoot>
      </ThemeProvider>
    </SafeAreaProvider>
  );
};

const ThemedRoot: React.FC = () => {
  // 기능: 테마에 맞춘 StatusBar + 로그인 여부에 따른 스택 분기
  const { isDark } = useTheme();
  return (
    <>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <AppNavigator />
    </>
  );
};

export default App;