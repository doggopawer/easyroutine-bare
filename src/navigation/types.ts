// src/navigation/types.ts
export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Detail: { message: string };
};

export type AppStackParamList = {
  Home: undefined;
  Detail: { message: string };
};

export type AuthStackParamList = {
  Login: undefined;
};