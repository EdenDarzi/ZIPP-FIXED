'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type Theme = 'light' | 'dark' | 'system';

interface ThemeContextValue {
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function getSystemPrefersDark(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function applyThemeClass(theme: Theme) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  const prefersDark = getSystemPrefersDark();
  const isDark = theme === 'dark' || (theme === 'system' && prefersDark);
  root.classList.toggle('dark', isDark);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('system');
  const [mounted, setMounted] = useState(false);

  // Mark as mounted to avoid hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  // Load saved theme on mount
  useEffect(() => {
    if (!mounted) return;
    
    try {
      const saved = (localStorage.getItem('zipp-theme') as Theme) || 'system';
      setThemeState(saved);
      applyThemeClass(saved);
    } catch {
      // noop
    }
  }, [mounted]);

  // Listen to system changes when theme is system
  useEffect(() => {
    if (!mounted || theme !== 'system') return;
    
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => applyThemeClass('system');
    media.addEventListener?.('change', handler);
    return () => media.removeEventListener?.('change', handler);
  }, [theme, mounted]);

  const setTheme = (next: Theme) => {
    setThemeState(next);
    try {
      localStorage.setItem('zipp-theme', next);
    } catch {
      // noop
    }
    applyThemeClass(next);
  };

  const toggleTheme = () => setTheme(document.documentElement.classList.contains('dark') ? 'light' : 'dark');

  const resolvedTheme = useMemo<'light' | 'dark'>(() => {
    if (!mounted) return 'light'; // Default durante hidratação
    if (theme === 'system') return getSystemPrefersDark() ? 'dark' : 'light';
    return theme;
  }, [theme, mounted]);

  const value: ThemeContextValue = {
    theme,
    resolvedTheme,
    setTheme,
    toggleTheme,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}


