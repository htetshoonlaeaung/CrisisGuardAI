import React, { createContext, useContext, useState, useEffect } from 'react';

export type AppThemeMode = 'dark' | 'light' | 'alert';

interface ThemeContextType {
  themeMode: AppThemeMode;
  setThemeMode: (mode: AppThemeMode) => void;
  isLight: boolean;
  isDark: boolean;
  isAlert: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
  themeMode: 'dark',
  setThemeMode: () => {},
  isLight: false,
  isDark: true,
  isAlert: false,
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeMode, setThemeModeState] = useState<AppThemeMode>(() => {
    const saved = localStorage.getItem('crisisguard_theme') as AppThemeMode;
    if (saved && (saved === 'dark' || saved === 'light' || saved === 'alert')) {
      return saved;
    }
    return 'dark';
  });

  const setThemeMode = (mode: AppThemeMode) => {
    setThemeModeState(mode);
    localStorage.setItem('crisisguard_theme', mode);
  };

  useEffect(() => {
    const root = document.documentElement;
    if (themeMode === 'light') {
      root.classList.add('light-theme');
      root.classList.remove('dark-theme', 'alert-theme');
    } else if (themeMode === 'alert') {
      root.classList.add('alert-theme');
      root.classList.remove('light-theme', 'dark-theme');
    } else {
      root.classList.add('dark-theme');
      root.classList.remove('light-theme', 'alert-theme');
    }
  }, [themeMode]);

  const isLight = themeMode === 'light';
  const isDark = themeMode === 'dark';
  const isAlert = themeMode === 'alert';

  return (
    <ThemeContext.Provider value={{ themeMode, setThemeMode, isLight, isDark, isAlert }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
