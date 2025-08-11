'use client';

import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/context/theme-context';
import { useLanguage } from '@/context/language-context';

export default function ThemeToggle() {
  const { resolvedTheme, toggleTheme, theme, setTheme } = useTheme();
  const { t } = useLanguage();

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        aria-label={resolvedTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        title={resolvedTheme === 'dark' ? t('theme.light', 'Light') : t('theme.dark', 'Dark')}
        onClick={toggleTheme}
        className="hover:bg-primary/10"
      >
        {resolvedTheme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      </Button>
    </div>
  );
}


