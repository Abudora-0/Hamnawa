import { useEffect, useRef, useState } from "react";
import { useSettings } from "../context/SettingsContext";
import { useVoices } from "../hooks/useVoices";
import { speech } from "../services/speech";
import { useDocument } from "../context/DocumentContext";
import { useAnnouncer } from "../context/AnnouncementContext";
import { deleteDocument } from "../services/api";
import { eraseAll, getRecent } from "../utils/documentMemory";
import PageHeader from "../components/PageHeader";
import { useLocation } from "react-router-dom";
import useHashScroll from "../hooks/useHashScroll";

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
  const location = useLocation();
  const {
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
  } = useSettings();
  const { setDocument } = useDocument();
  const { announce } = useAnnouncer();
  const [confirmErase, setConfirmErase] = useState(false);
  const eraseButtonRef = useRef(null);
  const explanationRef = useRef(null);
  const wasConfirmingRef = useRef(false);
  const voices = useVoices();
  useHashScroll(location.hash);

  useEffect(() => {
    if (confirmErase) {
      explanationRef.current?.focus();
    } else if (wasConfirmingRef.current) {
      eraseButtonRef.current?.focus();
    }
    wasConfirmingRef.current = confirmErase;
  }, [confirmErase]);

  function testVoice() {
    speech.cancel();
    speech.speak(
      "This is how Hamnawa will read to you.",
      { rate: speechRate, voiceName, engine: voiceEngine },
      () => {},
      announce,
    );
  }

  async function eraseSavedData() {
    const recentDocuments = getRecent();
    await Promise.all(
      recentDocuments.map((recentDocument) =>
        deleteDocument(recentDocument.id).catch(() => undefined),
      ),
    );
    eraseAll();
    setDocument(null);
    setConfirmErase(false);
    announce("All saved data erased");
  }

  return (
    <section className="settings-page">
      <PageHeader
        eyebrow="Settings / Make it yours"
        title="Settings"
        description="Tune the display, speech, keyboard, and saved data to your study style."
      />
      <div className="settings-layout">
        <nav className="settings-menu panel" aria-label="Settings sections">
          <a href="#display">Display</a>
          <a href="#speech">Speech</a>
          <a href="#keyboard">Keyboard</a>
          <a href="#saved-data">Saved data</a>
        </nav>
        <div className="settings-content">
      <fieldset className="settings-group panel">
        <legend id="display">Display</legend>
        <fieldset className="nested-group">
          <legend>Theme</legend>
          <div className="theme-tiles">
          {themes.map((option) => (
            <label className="theme-tile" key={option.value}>
              <input
                type="radio"
                name="theme"
                value={option.value}
                checked={theme === option.value}
                onChange={(event) => setTheme(event.target.value)}
              />
              <span className={`theme-preview theme-${option.value}`} aria-hidden="true">
                <span>Aa</span><i />
              </span>
              <strong>{option.label}</strong>
            </label>
          ))}
          </div>
        </fieldset>
        <fieldset className="nested-group">
          <legend>Motion</legend>
          <label className="switch-row">
            <input
              type="checkbox"
              checked={reduceMotion}
              onChange={(event) => setReduceMotion(event.target.checked)}
            />
            Reduce animations
          </label>
        </fieldset>
        <fieldset className="nested-group">
          <legend>Text size</legend>
          <div className="font-tiles">
          {fontSizes.map((option) => (
            <label className="font-tile" key={option.value}>
              <input
                type="radio"
                name="font-size"
                value={option.value}
                checked={fontSize === option.value}
                onChange={(event) => setFontSize(event.target.value)}
              />
              <span aria-hidden="true" className={`font-sample font-${option.value}`}>Aa</span>
              <strong>{option.label}</strong>
            </label>
          ))}
          </div>
        </fieldset>
      </fieldset>
      <fieldset className="settings-group panel" id="speech">
        <legend>Speech</legend>
        {speech.isSupported() ? (
          <>
            <fieldset className="nested-group">
              <legend>Voice engine</legend>
              <div className="segmented-control">
              <label>
                <input
                  type="radio"
                  name="voice-engine"
                  value="device"
                  checked={voiceEngine === "device"}
                  onChange={(event) => setVoiceEngine(event.target.value)}
                />
                <span>Device voice (works offline)</span>
              </label>
              <label>
                <input
                  type="radio"
                  name="voice-engine"
                  value="cloud"
                  checked={voiceEngine === "cloud"}
                  onChange={(event) => setVoiceEngine(event.target.value)}
                />
                <span>Cloud voice (clearer Urdu, needs internet)</span>
              </label>
              </div>
            </fieldset>
            <label className="range-label" htmlFor="speech-rate">
              <span>Speech speed</span><strong>{speechRate}x</strong>
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
            {voiceEngine === "device" ? (
              <>
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
              </>
            ) : null}
            <label className="switch-row">
              <input
                type="checkbox"
                checked={cuesEnabled}
                onChange={(event) => setCuesEnabled(event.target.checked)}
              />
              Announce headings and lists
            </label>
            <label className="switch-row">
              <input
                type="checkbox"
                checked={continuousReading}
                onChange={(event) => setContinuousReading(event.target.checked)}
              />
              Keep reading into the next section
            </label>
            <button className="btn-ghost" type="button" onClick={testVoice}>
              Test voice
            </button>
          </>
        ) : (
          <p>Speech is not supported in this browser.</p>
        )}
      </fieldset>
      <fieldset className="settings-group panel" id="keyboard">
        <legend>Keyboard</legend>
        <label className="switch-row">
          <input
            type="checkbox"
            checked={screenReaderMode}
            onChange={(event) => setScreenReaderMode(event.target.checked)}
          />
          Screen reader mode (shortcuts use Alt+Shift)
        </label>
        <p>
          This avoids clashes with screen reader keys.
        </p>
      </fieldset>
      <fieldset className="settings-group panel" id="saved-data">
        <legend>Saved data</legend>
        {!confirmErase ? (
          <button
            type="button"
            ref={eraseButtonRef}
            onClick={() => setConfirmErase(true)}
          >
            Erase all saved data
          </button>
        ) : (
          <div>
            <p ref={explanationRef} tabIndex={-1}>
              This removes recent documents, saved progress, bookmarks, quick
              phrases, and speech history. Your display and voice settings stay.
            </p>
            <button className="btn" type="button" onClick={eraseSavedData}>
              Yes, erase
            </button>
            <button className="btn-ghost" type="button" onClick={() => setConfirmErase(false)}>
              Cancel
            </button>
          </div>
        )}
      </fieldset>
        </div>
      </div>
    </section>
  );
}

export default Settings;
