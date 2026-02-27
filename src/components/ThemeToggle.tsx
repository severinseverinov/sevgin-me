"use client";

import { useEffect, useState, useCallback } from "react";

type Theme = "light" | "dark" | "system";

function applyThemeToDOM(t: Theme) {
  const root = document.documentElement;
  root.classList.remove("dark", "light");

  if (t === "dark") {
    root.classList.add("dark");
  } else if (t === "light") {
    root.classList.add("light");
  } else {
    // system: check OS preference and add class accordingly
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      root.classList.add("dark");
    }
  }
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("system");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("theme") as Theme | null;
    if (stored) {
      setTheme(stored);
      applyThemeToDOM(stored);
    } else {
      applyThemeToDOM("system");
    }

    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      const current = (localStorage.getItem("theme") as Theme) || "system";
      if (current === "system") applyThemeToDOM("system");
    };
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  const cycle = useCallback(() => {
    const next: Theme =
      theme === "system" ? "light" : theme === "light" ? "dark" : "system";
    setTheme(next);
    localStorage.setItem("theme", next);
    applyThemeToDOM(next);
  }, [theme]);

  if (!mounted) {
    return (
      <button
        className="w-9 h-9 rounded-lg flex items-center justify-center"
        aria-label="Toggle theme"
      >
        <span className="w-5 h-5" />
      </button>
    );
  }

  return (
    <button
      onClick={cycle}
      className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-[var(--color-surface-hover)] dark:hover:bg-[var(--color-surface-hover-dark)] transition-colors cursor-pointer"
      aria-label={`Current theme: ${theme}. Click to change.`}
      title={`Theme: ${theme}`}
    >
      {theme === "light" && (
        <svg
          className="w-5 h-5 text-amber-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      )}
      {theme === "dark" && (
        <svg
          className="w-5 h-5 text-blue-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      )}
      {theme === "system" && (
        <svg
          className="w-5 h-5 text-[var(--color-text-muted)]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      )}
    </button>
  );
}
