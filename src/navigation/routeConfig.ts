import { ComponentType } from 'react';
import LoginScreen from '@/features/auth/screens/LoginScreen';
import RoutineListScreen from '@/features/routine/screens/RoutineListScreen';
import RoutineEditScreen from '@/features/routine/screens/RoutineEditScreen';
import RoutineProgressScreen from '@/features/routine/screens/RoutineProgressScreen';
import LibraryScreen from '@/features/library/screens/LibraryScreen';
import MyPageScreen from '@/features/user/screens/MyPageScreen';
import StatisticsScreen from '@/features/history/screens/StatisticsScreen';
import CalendarScreen from '@/features/history/screens/CalendarScreen';
import { HistoryStackNavigator, HistoryTabNavigator, RoutineStackNavigator} from './AppNavigator';
import HistoryDetailScreen from '@/features/history/screens/HistoryDetailScreen';



export interface RouteConfig {
    name: string;
    component: ComponentType<any>;
    title?: string;
    options?: any;
}

export const authRoutes: RouteConfig[] = [
    { name: 'Login', component: LoginScreen, title: 'Login' },
];

export const mainTabRoutes: RouteConfig[] = [
    { name: 'Routine', component: RoutineStackNavigator, title: 'Routine' },
    { name: 'History', component: HistoryStackNavigator, title: 'History' },
    { name: 'Library', component: LibraryScreen, title: 'Library' },
    { name: 'MyPage', component: MyPageScreen, title: 'MyPage' },
];

export const routineStackRoutes: RouteConfig[] = [
    { name: 'RoutineList', component: RoutineListScreen, title: 'Routine' },
    { name: 'RoutineEdit', component: RoutineEditScreen, title: 'Edit Routine' },
    { name: 'RoutineProgress', component: RoutineProgressScreen, title: 'Routine Progress' },
];

export const historyStackRoutes: RouteConfig[] = [
    { name: 'History', component: HistoryTabNavigator, title: 'Calendar' },
    { name: 'HistoryDetail', component: HistoryDetailScreen, title: 'HistoryDetail' },
];

export const historyTabRoutes: RouteConfig[] = [
    { name: 'Calendar', component: CalendarScreen, title: 'Calendar' },
    { name: 'Statistics', component: StatisticsScreen, title: 'Statistics' },
];

export const libraryStackRoutes: RouteConfig[] = [
    { name: 'Library', component: LibraryScreen, title: 'Library' },
];

export const myPageStackRoutes: RouteConfig[] = [
    { name: 'MyPage', component: MyPageScreen, title: 'MyPage' },
];

