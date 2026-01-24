import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { enableScreens } from 'react-native-screens';
import { RecoilRoot } from 'recoil';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';

import Toast from 'react-native-toast-message'; // ✅✅✅ 추가

import { ThemeProvider, useTheme } from './src/theme/ThemeProvider/ThemeProvider';
import AppNavigator from './src/navigation/AppNavigator';
import ERToast from '@/components/ui/ERToast/ERToast';

// screens 최적화(앱 시작 1회)
enableScreens();

const queryClient = new QueryClient();

const toastConfig = {
  success: (props: any) => <ERToast {...props} type="success" />,
  error: (props: any) => <ERToast {...props} type="error" />,
  info: (props: any) => <ERToast {...props} type="info" />,
};

const App: React.FC = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <RecoilRoot>
            <QueryClientProvider client={queryClient}>
              <BottomSheetModalProvider>
                <ThemedRoot />

                {/* ✅✅✅ Toast 컴포넌트는 최하단에 두고 config 적용 */}
                <Toast config={toastConfig} position="top" topOffset={60} />
              </BottomSheetModalProvider>
            </QueryClientProvider>
          </RecoilRoot>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

const ThemedRoot: React.FC = () => {
  const { isDark } = useTheme();

  return (
    <>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <AppNavigator />
    </>
  );
};

export default App;
