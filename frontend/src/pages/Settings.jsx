import { useSettings } from "../context/SettingsContext";
import { useVoices } from "../hooks/useVoices";
import { speech } from "../services/speech";

const themes = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "contrast", label: "High contrast" },
];

const fontSizes = [
  { value: "small", label: "Small" },
  { value: "medium", label: "Medium" },
  { value: "large", label: "Large" },
  { value: "xlarge", label: "Extra large" },
];

function Settings() {
  const {
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
  } = useSettings();
  const voices = useVoices();

  function testVoice() {
    speech.cancel();
    speech.speak(
      "This is how Hamnawa will read to you.",
      { rate: speechRate, voiceName },
      () => {},
    );
  }

  return (
    <section>
      <h1>Settings</h1>
      <fieldset>
        <legend>Theme</legend>
        {themes.map((option) => (
          <label key={option.value}>
            <input
              type="radio"
              name="theme"
              value={option.value}
              checked={theme === option.value}
              onChange={(event) => setTheme(event.target.value)}
            />
            {option.label}
          </label>
        ))}
      </fieldset>
      <fieldset>
        <legend>Speech</legend>
        {speech.isSupported() ? (
          <>
            <label htmlFor="speech-rate">
              Speech speed: {speechRate}x
            </label>
            <input
              id="speech-rate"
              type="range"
              min="0.5"
              max="3"
              step="0.25"
              value={speechRate}
              aria-valuetext={`${speechRate} times normal speed`}
              onChange={(event) => setSpeechRate(Number(event.target.value))}
            />
            <label htmlFor="voice">Voice</label>
            <select
              id="voice"
              value={voiceName}
              onChange={(event) => setVoiceName(event.target.value)}
            >
              <option value="">Default voice</option>
              {voices.map((voice) => (
                <option key={`${voice.name}-${voice.lang}`} value={voice.name}>
                  {voice.name} ({voice.lang})
                </option>
              ))}
            </select>
            <label>
              <input
                type="checkbox"
                checked={cuesEnabled}
                onChange={(event) => setCuesEnabled(event.target.checked)}
              />
              Announce headings and lists
            </label>
            <label>
              <input
                type="checkbox"
                checked={continuousReading}
                onChange={(event) => setContinuousReading(event.target.checked)}
              />
              Keep reading into the next section
            </label>
            <button type="button" onClick={testVoice}>
              Test voice
            </button>
          </>
        ) : (
          <p>Speech is not supported in this browser.</p>
        )}
      </fieldset>
      <fieldset>
        <legend>Font size</legend>
        {fontSizes.map((option) => (
          <label key={option.value}>
            <input
              type="radio"
              name="font-size"
              value={option.value}
              checked={fontSize === option.value}
              onChange={(event) => setFontSize(event.target.value)}
            />
            {option.label}
          </label>
        ))}
      </fieldset>
    </section>
  );
}

export default Settings;
