import { useState } from "react";
import { useSpeaker } from "../hooks/useSpeaker";
import { useAnnouncer } from "../context/AnnouncementContext";
import { getJSON, setJSON } from "../utils/storage";
import { speech } from "../services/speech";

const QUICK_PHRASES_KEY = "hamnawa-quick-phrases";
const SPEAK_HISTORY_KEY = "hamnawa-speak-history";
const defaultPhrases = [
  "Yes",
  "No",
  "Thank you",
  "Please wait",
  "I need help",
  "Excuse me",
  "Please repeat that",
  "Where is the restroom",
];

function readList(key, fallback) {
  const value = getJSON(key, fallback);
  return Array.isArray(value) ? value.filter((item) => typeof item === "string") : fallback;
}

function SpeakAloud() {
  const [text, setText] = useState("");
  const [newPhrase, setNewPhrase] = useState("");
  const [phrases, setPhrases] = useState(() =>
    readList(QUICK_PHRASES_KEY, defaultPhrases),
  );
  const [history, setHistory] = useState(() =>
    readList(SPEAK_HISTORY_KEY, []),
  );
  const { speak, stop, isSpeaking } = useSpeaker();
  const { announce } = useAnnouncer();

  function saveHistory(value) {
    const nextHistory = [value, ...history.filter((item) => item !== value)].slice(
      0,
      20,
    );
    setHistory(nextHistory);
    setJSON(SPEAK_HISTORY_KEY, nextHistory);
  }

  function speakText(value) {
    const trimmedValue = value.trim();
    if (!trimmedValue) {
      return;
    }
    setText(trimmedValue);
    saveHistory(trimmedValue);
    speak(trimmedValue);
  }

  function handleSubmit(event) {
    event.preventDefault();
    speakText(text);
  }

  function handleTextKeyDown(event) {
    if (event.ctrlKey && event.key === "Enter") {
      event.preventDefault();
      speakText(text);
    }
  }

  function addPhrase(event) {
    event.preventDefault();
    const trimmedPhrase = newPhrase.trim();
    if (!trimmedPhrase || phrases.includes(trimmedPhrase)) {
      return;
    }
    const nextPhrases = [...phrases, trimmedPhrase];
    setPhrases(nextPhrases);
    setJSON(QUICK_PHRASES_KEY, nextPhrases);
    setNewPhrase("");
    announce("Phrase added");
  }

  function removePhrase(phrase) {
    const nextPhrases = phrases.filter((item) => item !== phrase);
    setPhrases(nextPhrases);
    setJSON(QUICK_PHRASES_KEY, nextPhrases);
    announce("Phrase removed");
  }

  function clearHistory() {
    setHistory([]);
    setJSON(SPEAK_HISTORY_KEY, []);
    announce("Speaking history cleared");
  }

  if (!speech.isSupported()) {
    return (
      <section>
        <h1>Speak Aloud</h1>
        <p role="alert">
          Speech is not supported in this browser. You can still type and use
          the other accessibility features.
        </p>
      </section>
    );
  }

  return (
    <section>
      <h1>Speak Aloud</h1>
      <p>Type a message for Hamnawa to say out loud.</p>
      <form onSubmit={handleSubmit}>
        <label htmlFor="speak-text">Type what you want to say</label>
        <textarea
          id="speak-text"
          value={text}
          onChange={(event) => setText(event.target.value)}
          onKeyDown={handleTextKeyDown}
          rows="5"
        />
        <div className="speak-actions">
          <button type="submit">Speak</button>
          <button type="button" onClick={stop} disabled={!isSpeaking}>
            Stop
          </button>
          <button type="button" onClick={() => setText("")}>
            Clear
          </button>
        </div>
      </form>
      <p className="speak-status">
        {isSpeaking ? "Speaking" : ""}
      </p>

      <h2>Quick phrases</h2>
      <div className="quick-phrases">
        {phrases.map((phrase) => (
          <div className="quick-phrase" key={phrase}>
            <button type="button" onClick={() => speakText(phrase)}>
              {phrase}
            </button>
            <button
              type="button"
              onClick={() => removePhrase(phrase)}
              aria-label={`Remove ${phrase}`}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
      <form className="add-phrase" onSubmit={addPhrase}>
        <label htmlFor="new-phrase">New phrase</label>
        <input
          id="new-phrase"
          value={newPhrase}
          onChange={(event) => setNewPhrase(event.target.value)}
        />
        <button type="submit">Add phrase</button>
      </form>

      <h2>History</h2>
      {history.length ? (
        <>
          <ol className="speak-history">
            {history.map((item) => (
              <li key={item}>
                <span>{item}</span>
                <button type="button" onClick={() => speakText(item)}>
                  Speak again
                </button>
              </li>
            ))}
          </ol>
          <button type="button" onClick={clearHistory}>
            Clear history
          </button>
        </>
      ) : (
        <p>No speaking history yet.</p>
      )}
    </section>
  );
}

export default SpeakAloud;
