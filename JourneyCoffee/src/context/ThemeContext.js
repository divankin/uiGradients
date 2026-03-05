import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { lightTheme, darkTheme, createTypography } from '../theme';
import { loadSettings } from '../utils/storage';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const systemScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState('system');

  useEffect(() => {
    loadSettings().then((settings) => {
      if (settings?.themeMode) setThemeMode(settings.themeMode);
    });
  }, []);

  const resolvedMode = useMemo(() => {
    if (themeMode === 'system') return systemScheme || 'light';
    return themeMode;
  }, [themeMode, systemScheme]);

  const theme = resolvedMode === 'dark' ? darkTheme : lightTheme;
  const typography = createTypography(theme);

  const value = useMemo(
    () => ({ theme, typography, themeMode, setThemeMode, isDark: resolvedMode === 'dark' }),
    [theme, typography, themeMode, resolvedMode],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
