import { createContext, useContext, useEffect, useState } from "react";

const SettingsContext = createContext(null);

function getStoredValue(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value || fallback;
  } catch {
    return fallback;
  }
}

function saveValue(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {
    return;
  }
}

export function SettingsProvider({ children }) {
  const [theme, setTheme] = useState(() => getStoredValue("hamnawa-theme", "light"));
  const [fontSize, setFontSize] = useState(() =>
    getStoredValue("hamnawa-font-size", "medium"),
  );

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    saveValue("hamnawa-theme", theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.dataset.font = fontSize;
    saveValue("hamnawa-font-size", fontSize);
  }, [fontSize]);

  return (
    <SettingsContext.Provider value={{ theme, setTheme, fontSize, setFontSize }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
