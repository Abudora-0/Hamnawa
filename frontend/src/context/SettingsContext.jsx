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

function getStoredNumber(key, fallback, min, max) {
  const parsed = Number(getStoredValue(key, ""));
  return Number.isFinite(parsed)
    ? Math.min(max, Math.max(min, parsed))
    : fallback;
}

function getStoredBoolean(key, fallback) {
  const value = getStoredValue(key, "");
  return value === "true" || value === "false" ? value === "true" : fallback;
}

export function SettingsProvider({ children }) {
  const [theme, setTheme] = useState(() => getStoredValue("hamnawa-theme", "light"));
  const [fontSize, setFontSize] = useState(() =>
    getStoredValue("hamnawa-font-size", "medium"),
  );
  const [speechRate, setSpeechRate] = useState(() =>
    getStoredNumber("hamnawa-speech-rate", 1, 0.5, 3),
  );
  const [voiceName, setVoiceName] = useState(() =>
    getStoredValue("hamnawa-voice-name", ""),
  );
  const [cuesEnabled, setCuesEnabled] = useState(() =>
    getStoredBoolean("hamnawa-cues-enabled", true),
  );
  const [continuousReading, setContinuousReading] = useState(() =>
    getStoredBoolean("hamnawa-continuous-reading", true),
  );

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    saveValue("hamnawa-theme", theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.dataset.font = fontSize;
    saveValue("hamnawa-font-size", fontSize);
  }, [fontSize]);

  useEffect(() => saveValue("hamnawa-speech-rate", speechRate), [speechRate]);
  useEffect(() => saveValue("hamnawa-voice-name", voiceName), [voiceName]);
  useEffect(() => saveValue("hamnawa-cues-enabled", cuesEnabled), [cuesEnabled]);
  useEffect(
    () => saveValue("hamnawa-continuous-reading", continuousReading),
    [continuousReading],
  );

  return (
    <SettingsContext.Provider
      value={{
        theme,
        setTheme,
        fontSize,
        setFontSize,
        speechRate,
        setSpeechRate,
        voiceName,
        setVoiceName,
        cuesEnabled,
        setCuesEnabled,
        continuousReading,
        setContinuousReading,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
