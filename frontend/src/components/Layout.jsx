import React, { useState, useEffect } from 'react';
import { Smartphone, Moon, Sun } from 'lucide-react';

const Layout = ({ children }) => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check initial preference
    if (document.documentElement.classList.contains('dark')) {
      setIsDark(true);
    }
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    if (!isDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.style.setProperty('color-scheme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.style.setProperty('color-scheme', 'light');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-12 px-4 bg-[#f8fafc] text-slate-900 transition-colors duration-300 dark:bg-[#0f172a] dark:text-slate-200">
      <header className="w-full max-w-6xl flex justify-between items-center mb-12">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/10 rounded-xl">
            <Smartphone className="w-6 h-6 text-blue-500" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-800 dark:text-white">
            Smartphone Classifier
          </h1>
        </div>
        <button 
          onClick={toggleTheme}
          className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition-colors"
        >
          {isDark ? <Sun className="w-5 h-5 text-slate-400" /> : <Moon className="w-5 h-5 text-slate-400" />}
        </button>
      </header>
      
      <main className="flex-1 w-full max-w-4xl flex flex-col items-center justify-center">
        {children}
      </main>

      <footer className="mt-12 text-slate-400 text-xs uppercase tracking-[0.2em] font-medium opacity-80">
        © Smartphone Price Range Classifier
      </footer>
    </div>
  );
};

export default Layout;

