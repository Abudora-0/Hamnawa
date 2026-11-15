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
  let storedValue;
  try {
    storedValue = localStorage.getItem(key);
  } catch {
    return fallback;
  }
  if (!storedValue) {
    return fallback;
  }
  const parsed = Number(storedValue);
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
  const [voiceEngine, setVoiceEngine] = useState(() =>
    getStoredValue("hamnawa-voice-engine", "device"),
  );
  const [cuesEnabled, setCuesEnabled] = useState(() =>
    getStoredBoolean("hamnawa-cues-enabled", true),
  );
  const [continuousReading, setContinuousReading] = useState(() =>
    getStoredBoolean("hamnawa-continuous-reading", true),
  );
  const [screenReaderMode, setScreenReaderMode] = useState(() =>
    getStoredBoolean("hamnawa-screen-reader-mode", false),
  );
  const [reduceMotion, setReduceMotion] = useState(() =>
    getStoredBoolean("hamnawa-reduce-motion", false),
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
  useEffect(() => saveValue("hamnawa-voice-engine", voiceEngine), [voiceEngine]);
  useEffect(() => saveValue("hamnawa-cues-enabled", cuesEnabled), [cuesEnabled]);
  useEffect(
    () => saveValue("hamnawa-continuous-reading", continuousReading),
    [continuousReading],
  );
  useEffect(
    () => saveValue("hamnawa-screen-reader-mode", screenReaderMode),
    [screenReaderMode],
  );
  useEffect(() => {
    if (reduceMotion) {
      document.documentElement.dataset.motion = "reduced";
    } else {
      delete document.documentElement.dataset.motion;
    }
    saveValue("hamnawa-reduce-motion", reduceMotion);
  }, [reduceMotion]);

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
        voiceEngine,
        setVoiceEngine,
        cuesEnabled,
        setCuesEnabled,
        continuousReading,
        setContinuousReading,
        screenReaderMode,
        setScreenReaderMode,
        reduceMotion,
        setReduceMotion,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
