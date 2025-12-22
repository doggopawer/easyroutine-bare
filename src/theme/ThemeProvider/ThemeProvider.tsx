// src/theme/ThemeProvider.tsx
import React, { createContext, useContext, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { ThemeProvider as StyledProvider } from 'styled-components/native';
import type { DefaultTheme } from 'styled-components';

const lightTheme: DefaultTheme = {
  name: 'light',
  colors: {
    // Grayscale
    white1: '#ffffff',
    black1: '#161616',
    gray1: '#333333',
    gray2: '#666666',
    gray3: '#999999',
    gray4: '#cccccc',
    gray5: '#eeeeee',
    gray6: '#f4f4f4',
    gray7: '#f8f8f8',

    // Brand / Accent
    blue1: '#3b82f6',
    blue2: '#eff6ff',

    // Status
    red1: '#ef3636',
    red2: '#ffedeb',
    green1: '#317b0f',
    green2: '#e8fdde',

    // Primary
    primary1: '#e88731',
    primary2: '#fff5eb',
    primary3: '#ffe8d2',
    primary4: '#ffd8b2',
    primary5: '#ffc489',
    primary6: '#fffcf6',

    // Alpha Tokens
    primaryAlpha16: 'rgba(255, 154, 62, 0.16)',
    primaryAlpha24: 'rgba(255, 154, 62, 0.24)',

    // Gradients
    gradient1: 'linear-gradient(90deg, #ffb143 0%, #ff7a58 100%)',
    gradient2: 'linear-gradient(180deg, #ff9a3e 0%, #ff5c00 100%)',

    // Backdrop
    backdropColor: 'rgba(0, 0, 0, 0.4)',
    backdropBlur: 6,
    backdropWebkitBlur: 6,

    // Legacy Mappings
    background: '#ffffff', // white1
    surface: '#f8f8f8', // gray7
    text: '#161616', // black1
    textMuted: '#999999', // gray3
    primary: '#e88731', // primary1
    primaryText: '#ffffff', // white1
    border: '#eeeeee', // gray5
  },
};

const darkTheme: DefaultTheme = {
  name: 'dark',
  colors: {
    // Grayscale (Inverted)
    white1: '#161616', // black1
    black1: '#ffffff', // white1
    gray1: '#f8f8f8', // gray7
    gray2: '#f4f4f4', // gray6
    gray3: '#eeeeee', // gray5
    gray4: '#cccccc', // gray4
    gray5: '#999999', // gray3
    gray6: '#666666', // gray2
    gray7: '#333333', // gray1

    // Brand / Accent
    blue1: '#3b82f6',
    blue2: '#eff6ff',

    // Status (Dark variants)
    red1: '#ff6b6b',
    red2: '#5c1e1e',
    green1: '#86efac',
    green2: '#14532d',

    // Primary (Dark variants)
    primary1: '#ff9a3e',
    primary2: '#2a1f18',
    primary3: '#3a2618',
    primary4: '#4a2f1c',
    primary5: '#5b3a22',
    primary6: '#6b4522',

    // Alpha Tokens
    primaryAlpha16: 'rgba(255, 154, 62, 0.16)',
    primaryAlpha24: 'rgba(255, 154, 62, 0.24)',

    // Gradients
    gradient1: 'linear-gradient(90deg, #ffb143 0%, #ff7a58 100%)',
    gradient2: 'linear-gradient(180deg, #ff9a3e 0%, #ff5c00 100%)',

    // Backdrop
    backdropColor: 'rgba(255, 255, 255, 0.3)',
    backdropBlur: 8,
    backdropWebkitBlur: 8,

    // Legacy Mappings
    background: '#161616', // white1 (which is black1 in dark mode)
    surface: '#333333', // gray7 (which is gray1 in dark mode)
    text: '#ffffff', // black1 (which is white1 in dark mode)
    textMuted: '#eeeeee', // gray3 (which is gray5 in dark mode)
    primary: '#ff9a3e', // primary1
    primaryText: '#161616', // white1 (which is black1 in dark mode)
    border: '#999999', // gray5 (which is gray3 in dark mode)
  },
};

type ThemeContextValue = {
  theme: DefaultTheme;
  isDark: boolean;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isDark = useColorScheme() === 'dark';
  const theme = useMemo<DefaultTheme>(() => (isDark ? darkTheme : lightTheme), [isDark]);
  const value = useMemo<ThemeContextValue>(() => ({ theme, isDark }), [theme, isDark]);

  return (
    <ThemeContext.Provider value={value}>
      <StyledProvider theme={theme}>{children}</StyledProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextValue => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
};
