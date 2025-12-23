import { ComponentType } from 'react';

import LoginScreen from '@/features/auth/screens/LoginScreen';
import RoutineListScreen from '@/features/routine/screens/RoutineListScreen';
import RoutineEditScreen from '@/features/routine/screens/RoutineEditScreen';
import RoutineProgressScreen from '@/features/routine/screens/RoutineProgressScreen';
import LibraryScreen from '@/features/library/screens/LibraryScreen';
import MyPageScreen from '@/features/user/screens/MyPageScreen';
import StatisticsScreen from '@/features/history/screens/StatisticsScreen';
import CalendarScreen from '@/features/history/screens/CalendarScreen';
import HistoryDetailScreen from '@/features/history/screens/HistoryDetailScreen';

import { HistoryStackNavigator, HistoryTabNavigator, RoutineStackNavigator } from './AppNavigator';

export interface RouteConfig {
  name: string; // ✅ 식별자 (영어, 절대 변경 X)
  component: ComponentType<any>;
  title?: string; // ✅ 화면 표시용 (한글)
  options?: any;
}

/* =========================
   Auth
========================= */

export const authRoutes: RouteConfig[] = [
  { name: 'Login', component: LoginScreen, title: '로그인' },
];

/* =========================
   Main Tab
========================= */

export const mainTabRoutes: RouteConfig[] = [
  { name: 'Home', component: RoutineStackNavigator, title: '홈' },
  { name: 'History', component: HistoryStackNavigator, title: '기록' },
  { name: 'Library', component: LibraryScreen, title: '라이브러리' },
  { name: 'MyPage', component: MyPageScreen, title: '마이' },
];

/* =========================
   Routine Stack
========================= */

export const routineStackRoutes: RouteConfig[] = [
  { name: 'RoutineList', component: RoutineListScreen, title: '루틴 목록' },
  { name: 'RoutineEdit', component: RoutineEditScreen, title: '루틴 수정' },
  { name: 'RoutineProgress', component: RoutineProgressScreen, title: '루틴 진행' },
];

/* =========================
   History Stack
========================= */

export const historyStackRoutes: RouteConfig[] = [
  { name: 'HistoryTabs', component: HistoryTabNavigator, title: '기록' },
  { name: 'HistoryDetail', component: HistoryDetailScreen, title: '기록 상세' },
];

/* =========================
   History Top Tabs
========================= */

export const historyTabRoutes: RouteConfig[] = [
  { name: 'Calendar', component: CalendarScreen, title: '캘린더' },
  { name: 'Statistics', component: StatisticsScreen, title: '통계' },
];

/* =========================
   Library Stack
========================= */

export const libraryStackRoutes: RouteConfig[] = [
  { name: 'Library', component: LibraryScreen, title: '라이브러리' },
];

/* =========================
   MyPage Stack
========================= */

export const myPageStackRoutes: RouteConfig[] = [
  { name: 'MyPage', component: MyPageScreen, title: '마이페이지' },
];
