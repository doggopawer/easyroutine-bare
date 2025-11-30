import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import {
    AuthStackParamList,
    HistoryStackParamList,
    MainTabParamList,
    RootStackParamList,
    RoutineStackParamList,
} from './types';
import {
    authRoutes,
    mainTabRoutes,
    historyTabRoutes,
    historyStackRoutes,
    routineStackRoutes,
} from './routeConfig';


// --- Navigators Definitions ---


// 5. Root Stack (Auth vs Main)
const RootStack = createNativeStackNavigator<RootStackParamList>();
const AppNavigator = () => {
    // Mock auth state
    const [isLoggedIn, setIsLoggedIn] = useState(true);

    return (
        <NavigationContainer>
            <RootStack.Navigator screenOptions={{ headerShown: false }}>
                {isLoggedIn ? (
                    <RootStack.Screen name="Main" component={MainTabNavigator} />
                ) : (
                    <RootStack.Screen name="Auth" component={AuthStackNavigator} />
                )}
            </RootStack.Navigator>
        </NavigationContainer>
    );
};


// 인증 스택 라우팅을 정의
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
export const AuthStackNavigator = () => (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
        {authRoutes.map((route) => (
            <AuthStack.Screen
                key={route.name}
                name={route.name as keyof AuthStackParamList}
                component={route.component}
                options={route.options}
            />
        ))}
    </AuthStack.Navigator>
);

// 4. Main Tab (using MaterialTopTab for animation, positioned bottom)
const MainTab = createBottomTabNavigator<MainTabParamList>();
export const MainTabNavigator = () => (
    <MainTab.Navigator
        tabBar={() => null}
        screenOptions={{ headerShown: false }}
    >
        {mainTabRoutes.map((route) => (
                <MainTab.Screen
                    key={route.name}
                    name={route.name as keyof MainTabParamList}
                    component={route.component}
                    options={route.options}
                />
        ))}
    </MainTab.Navigator>
);

// 홈 스크린에서 스택 라우팅을 정의
const RoutineStack = createNativeStackNavigator<RoutineStackParamList>();
export const RoutineStackNavigator = () => (
    <RoutineStack.Navigator screenOptions={{ headerShown: false }}>
        {routineStackRoutes.map((route) => (
            <RoutineStack.Screen
                key={route.name}
                name={route.name as keyof RoutineStackParamList}
                component={route.component}
                options={route.options}
            />
        ))}
    </RoutineStack.Navigator>
);

// 기록 스크린에서 탭 라우팅을 정의
const HistoryStack = createNativeStackNavigator<HistoryStackParamList>();
export const HistoryStackNavigator = () => (
    <HistoryStack.Navigator
        screenOptions={{ headerShown: false }}
    >
        {historyStackRoutes.map((route) => (
            <HistoryStack.Screen
                key={route.name}
                name={route.name as keyof HistoryStackParamList}
                component={route.component}
            />
        ))}
    </HistoryStack.Navigator>
);

const HistoryTab = createMaterialTopTabNavigator<HistoryStackParamList>();
export const HistoryTabNavigator = () => (
    <HistoryTab.Navigator screenOptions={{ tabBarStyle: {display: 'none'} }}>
        {historyTabRoutes.map((route) => (
            <HistoryTab.Screen
                key={route.name}
                name={route.name as keyof HistoryStackParamList}
                component={route.component}
                options={route.options}
            />
        ))}
    </HistoryTab.Navigator>
);







export default AppNavigator;
