import { useState } from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTheme } from '../contexts/ThemeContext';

type ThemeOption = 'light' | 'dark' | 'system';

export function Settings() {
  const { theme, setTheme } = useTheme();
  const [selectedTheme, setSelectedTheme] = useState<ThemeOption>(
    localStorage.getItem('theme-preference') as ThemeOption || 'system'
  );

  const handleThemeChange = (newTheme: ThemeOption) => {
    setSelectedTheme(newTheme);
    localStorage.setItem('theme-preference', newTheme);

    if (newTheme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      setTheme(systemTheme);
    } else {
      setTheme(newTheme);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your application preferences</p>
      </div>

      {/* Appearance Section */}
      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>
            Customize how Football Recorder looks on your device
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-3">Theme</h3>
            <div className="grid gap-3 sm:grid-cols-3">
              {/* Light Theme */}
              <button
                onClick={() => handleThemeChange('light')}
                className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-colors ${
                  selectedTheme === 'light'
                    ? 'border-primary bg-accent'
                    : 'border-border hover:border-muted-foreground/50'
                }`}
              >
                <Sun className="h-6 w-6" />
                <span className="text-sm font-medium">Light</span>
              </button>

              {/* Dark Theme */}
              <button
                onClick={() => handleThemeChange('dark')}
                className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-colors ${
                  selectedTheme === 'dark'
                    ? 'border-primary bg-accent'
                    : 'border-border hover:border-muted-foreground/50'
                }`}
              >
                <Moon className="h-6 w-6" />
                <span className="text-sm font-medium">Dark</span>
              </button>

              {/* System Theme */}
              <button
                onClick={() => handleThemeChange('system')}
                className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-colors ${
                  selectedTheme === 'system'
                    ? 'border-primary bg-accent'
                    : 'border-border hover:border-muted-foreground/50'
                }`}
              >
                <Monitor className="h-6 w-6" />
                <span className="text-sm font-medium">System</span>
              </button>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              {selectedTheme === 'system'
                ? 'Automatically switches between light and dark based on your system preferences'
                : `Using ${selectedTheme} theme`}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* About Section */}
      <Card>
        <CardHeader>
          <CardTitle>About</CardTitle>
          <CardDescription>
            Information about Football Recorder
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Version</span>
            <span className="font-medium">1.0.0</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Database</span>
            <span className="font-medium">Supabase</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
