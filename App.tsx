// App.tsx
// 기능: 네이티브 스택 네비게이션 + react-native-screens 최적화(enableScreens) + ThemeProvider 연동

import React from 'react';
import { StatusBar, StyleSheet, View, Text, Pressable } from 'react-native';
import {
  SafeAreaProvider,
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { enableScreens } from 'react-native-screens';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';
import BasicButton from './src/components/BasicButton/BasicButton';
import { ThemeProvider, useTheme } from './src/theme/ThemeProvider/ThemeProvider';

// screens 최적화 활성화(앱 시작 시 1회)
enableScreens();

// --- Stack Param 정의(타입 안전) ---
type RootStackParamList = {
  Home: undefined;
  Detail: { message: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

// --- App 엔트리: Provider + ThemeProvider + NavigationContainer ---
const App: React.FC = () => {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <ThemedRoot />
      </ThemeProvider>
    </SafeAreaProvider>
  );
};

// --- 테마에 맞춘 StatusBar 및 내비게이션 트리 ---
const ThemedRoot: React.FC = () => {
  const { isDark } = useTheme();
  return (
    <>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerTitleAlign: 'left' }}>
          <Stack.Screen name="Home" component={HomeScreen} options={{ title: '홈' }} />
          <Stack.Screen name="Detail" component={DetailScreen} options={{ title: '상세' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
};

// --- Home 화면: 기본 UI + 상세로 이동 버튼 ---
const HomeScreen: React.FC<NativeStackScreenProps<RootStackParamList, 'Home'>> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();

  const onGoDetail = () => {
    navigation.navigate('Detail', { message: '홈에서 보낸 메시지입니다람쥐 👋' });
  };

  return (
    <SafeAreaView
      style={[
        styles.safe,
        { paddingTop: insets.top, paddingBottom: insets.bottom, backgroundColor: theme.colors.background },
      ]}
    >
      <View style={styles.container}>
        <Text style={[styles.title, { color: theme.colors.text }]}>안녕하세요 👋</Text>
        <Text style={[styles.desc, { color: theme.colors.textMuted }]}>이 화면이 기본 홈입니다.</Text>
        <View
          style={[
            styles.box,
            { backgroundColor: theme.colors.surface, shadowColor: '#000' },
          ]}
        >
          <Text style={[styles.item, { color: theme.colors.text }]}>• View/Text는 웹의 div/span 역할</Text>
          <Text style={[styles.item, { color: theme.colors.text }]}>• 스타일은 StyleSheet 객체로 지정</Text>
          <Text style={[styles.item, { color: theme.colors.text }]}>• 네비게이션은 React Navigation(Stack)</Text>
        </View>

        <Pressable
          onPress={onGoDetail}
          style={({ pressed }) => [
            styles.btn,
            { backgroundColor: theme.colors.primary },
            pressed && styles.btnPressed,
          ]}
          accessibilityRole="button"
        >
          <Text style={[styles.btnLabel, { color: theme.colors.primaryText }]}>상세 화면으로 이동</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

// --- Detail 화면: 파라미터 표시 + 뒤로가기 ---
const DetailScreen: React.FC<NativeStackScreenProps<RootStackParamList, 'Detail'>> = ({ route, navigation }) => {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { message } = route.params;

  const onGoBack = () => navigation.goBack();

  return (
    <SafeAreaView
      style={[
        styles.safe,
        { paddingTop: insets.top, paddingBottom: insets.bottom, backgroundColor: theme.colors.background },
      ]}
    >
      <View style={styles.container}>
        <Text style={[styles.title, { color: theme.colors.text }]}>상세 화면</Text>
        <Text style={[styles.desc, { color: theme.colors.textMuted }]}>{message}</Text>

        <BasicButton onPress={onGoBack}>뒤로가귀</BasicButton>
      </View>
    </SafeAreaView>
  );
};

// --- 스타일 (색은 테마에서 덮어씌움) ---
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 12,
    gap: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111',
  },
  desc: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  box: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#fff',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
    gap: 6,
  },
  item: {
    fontSize: 13,
    color: '#333',
  },
  btn: {
    marginTop: 8,
    backgroundColor: '#111',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  btnPressed: {
    opacity: 0.75,
  },
  btnLabel: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default App;