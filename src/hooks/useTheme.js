import { useState, useEffect } from "react";

/**
 * useTheme
 *
 * Priority order:
 * 1. If user has manually toggled → use their saved preference (localStorage)
 * 2. If no saved preference → use device/OS system preference (prefers-color-scheme)
 * 3. If system preference unknown → default to dark
 *
 * When user manually toggles, their choice is saved to localStorage
 * and overrides the system preference until they clear it.
 */
export function useTheme() {
  const [dark, setDarkState] = useState(() => {
    try {
      const saved = localStorage.getItem("karin_theme");
      if (saved) return saved === "dark";                          // user's manual choice
      return window.matchMedia("(prefers-color-scheme: dark)").matches; // system preference
    } catch {
      return true; // fallback
    }
  });

  // Apply class to body whenever theme changes
  useEffect(() => {
    document.body.className = dark ? "dark" : "light";
    try { localStorage.setItem("karin_theme", dark ? "dark" : "light"); } catch {}
  }, [dark]);

  // Listen for system preference changes (e.g. user switches OS theme)
  // Only applies if user hasn't manually set a preference
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e) => {
      const hasManualPreference = localStorage.getItem("karin_theme_manual");
      if (!hasManualPreference) {
        setDarkState(e.matches);
      }
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // setDark — marks as manual override
  const setDark = (val) => {
    const newVal = typeof val === "function" ? val(dark) : val;
    try { localStorage.setItem("karin_theme_manual", "true"); } catch {}
    setDarkState(newVal);
  };

  return [dark, setDark];
}
