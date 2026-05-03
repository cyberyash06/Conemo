"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className={`w-12 h-12 ${className || ''}`}></div>;
  }

  return (
    <button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className={`p-3 rounded-full bg-white/60 dark:bg-[#0a0f1d]/60 backdrop-blur-xl border border-slate-200 dark:border-white/10 shadow-lg text-slate-800 dark:text-slate-200 hover:scale-110 active:scale-95 transition-all flex items-center justify-center ${className || ''}`}
      aria-label="Toggle theme"
    >
      {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
    </button>
  );
}
