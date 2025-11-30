import { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainTabParamList>;
};

export type AuthStackParamList = {
  Login: undefined;
};

export type MainTabParamList = {
  Home: NavigatorScreenParams<RoutineStackParamList>;
  History: NavigatorScreenParams<HistoryStackParamList>;
  Library: undefined;
  MyPage: undefined;
};

export type RoutineStackParamList = {
  RoutineList: undefined;
  RoutineEdit: undefined;
  RoutineProgress: undefined;
};

export type HistoryStackParamList = {
  History: undefined;
  HistoryDetail: { recordId: string };
};

export type HistoryTabParamList = {
  Statistics: undefined;
  Calendar: undefined;
};

export type LibraryStackParamList = {
  Library: undefined;
};

export type MyPageStackParamList = {
  MyPage: undefined;
};