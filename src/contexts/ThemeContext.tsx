"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
  type ReactNode,
} from "react";

interface ThemeCtx {
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeCtx>({
  isDark: false,
  toggleTheme: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isDark, setIsDark] = useState(false);

  // Only true after the user explicitly clicks toggle.
  // The write effect checks this — so it never fires on initial mount
  // regardless of what state value is at that point.
  const userToggled = useRef(false);

  // READ — runs once on mount, applies theme from storage, never writes
  useEffect(() => {
    const stored = localStorage.getItem("jsprep-theme");
    const prefersDark =
      stored === "dark" ||
      (!stored && window.matchMedia("(prefers-color-scheme: dark)").matches);

    document.documentElement.setAttribute(
      "data-theme",
      prefersDark ? "dark" : "light",
    );

    setIsDark(prefersDark);
  }, []);

  // WRITE — only runs when the user has actually clicked toggle
  useEffect(() => {
    if (!userToggled.current) return;

    document.documentElement.setAttribute(
      "data-theme",
      isDark ? "dark" : "light",
    );
    localStorage.setItem("jsprep-theme", isDark ? "dark" : "light");
  }, [isDark]);

  const toggleTheme = useCallback(() => {
    userToggled.current = true; // open the gate before the state update
    setIsDark((d) => !d);
  }, []);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
