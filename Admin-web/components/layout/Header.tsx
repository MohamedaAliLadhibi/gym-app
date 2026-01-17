'use client';

import React from 'react';
import { Bell, Search, User, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';

const Header = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="bg-card shadow border-b border-border">
      <div className="px-4 py-4 sm:px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center flex-1">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 w-full border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent bg-background text-foreground"
              />
            </div>
          </div>
          <div className="flex items-center ml-4 space-x-4">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 text-muted-foreground hover:text-foreground"
            >
              {mounted && (theme === 'dark' ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />)}
            </button>
            <button className="relative p-2 text-muted-foreground hover:text-foreground">
              <Bell className="h-6 w-6" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-destructive rounded-full"></span>
            </button>
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                <User className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-foreground">Admin User</p>
                <p className="text-xs text-muted-foreground">Administrator</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;