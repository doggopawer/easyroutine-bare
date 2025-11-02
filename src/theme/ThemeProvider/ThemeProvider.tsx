// src/theme/ThemeProvider.tsx
import React, { createContext, useContext, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { ThemeProvider as StyledProvider } from 'styled-components/native';
import type { DefaultTheme } from 'styled-components';

const lightTheme: DefaultTheme = {
  name: 'light',
  colors: {
    background: '#F7F8FA',
    surface: '#FFFFFF',
    text: '#111111',
    textMuted: '#666666',
    primary: '#82b1ff',
    primaryText: '#FFFFFF',
    border: '#E5E5E5',
  },
};

const darkTheme: DefaultTheme = {
  name: 'dark',
  colors: {
    background: '#0B0B0C',
    surface: '#161719',
    text: '#F5F7FA',
    textMuted: '#AAB2BD',
    primary: '#4a6aff',
    primaryText: '#FFFFFF',
    border: '#2A2C30',
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