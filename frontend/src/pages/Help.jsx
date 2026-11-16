import { getShortcutLabel, getShortcuts } from "../utils/shortcuts";
import { useSettings } from "../context/SettingsContext";
import PageHeader from "../components/PageHeader";
import { useLocation } from "react-router-dom";
import useHashScroll from "../hooks/useHashScroll";

const voiceCommands = [
  "play",
  "pause",
  "next",
  "previous",
  "next section",
  "faster",
  "slower",
  "repeat",
  "bookmark",
  "go to page 5",
  "search for WORD",
  "help",
];

function Help() {
  const location = useLocation();
  const { screenReaderMode } = useSettings();
  const activeShortcuts = getShortcuts(screenReaderMode);
  useHashScroll(location.hash);

  return (
    <section className="help-page">
      <PageHeader
        eyebrow="Help / Find your way"
        title="Help"
        description="Short guides for reading, listening, and finding your way around Hamnawa."
      />
      <div className="help-layout">
        <nav className="help-contents panel" aria-label="Help contents">
          <strong>On this page</strong>
          <a className="link" href="#getting-started">Getting started</a>
          <a className="link" href="#keyboard-shortcuts">Keyboard shortcuts</a>
          <a className="link" href="#voice-commands">Voice commands</a>
          <a className="link" href="#speak-aloud">Speak Aloud</a>
          <a className="link" href="#troubleshooting">Troubleshooting</a>
        </nav>
        <div className="help-content">
          <section id="getting-started">
            <h2>Getting started</h2>
            <span className="thread thread-under" aria-hidden="true" />
            <ol>
              <li>Upload a PDF or PowerPoint file.</li>
              <li>Open the reader and choose Play or use the keyboard shortcuts.</li>
              <li>Adjust speech, display, and accessibility settings as needed.</li>
            </ol>
          </section>

          <section id="keyboard-shortcuts">
            <h2>Keyboard shortcuts</h2>
            <span className="thread thread-under" aria-hidden="true" />
            <div className="table-wrap" role="region" aria-label="Keyboard shortcuts table" tabIndex={0}> {/* eslint-disable-line jsx-a11y/no-noninteractive-tabindex */}
              <table>
                <caption>Shortcuts for the current mode</caption>
                <thead>
                  <tr><th scope="col">Key</th><th scope="col">Action</th></tr>
                </thead>
                <tbody>
                  {activeShortcuts.map((shortcut) => (
                    <tr key={`${shortcut.key}-${shortcut.action}`}>
                      <td><kbd>{getShortcutLabel(shortcut, screenReaderMode)}</kbd></td>
                      <td>{shortcut.label}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section id="voice-commands">
            <h2>Voice commands</h2>
            <span className="thread thread-under" aria-hidden="true" />
            <p>Say one of these commands while voice commands are on:</p>
            <p>Use headphones, so the microphone does not hear the reader.</p>
            <ul className="say-list">
              {voiceCommands.map((command) => (
                <li key={command}>&quot;{command}&quot;</li>
              ))}
            </ul>
          </section>

          <section id="speak-aloud">
            <h2>Speak Aloud</h2>
            <span className="thread thread-under" aria-hidden="true" />
            <p>
              Speak Aloud lets you type a message and have it spoken one
              sentence at a time. It also provides quick phrases and a history
              of recent speech.
            </p>
          </section>

          <section id="troubleshooting">
            <h2>Troubleshooting</h2>
            <span className="thread thread-under" aria-hidden="true" />
            <details>
              <summary>No sound</summary>
              <p>Check your device volume, selected voice, and speech speed settings.</p>
            </details>
            <details>
              <summary>Urdu voice missing</summary>
              <p>Install or enable an Urdu voice in your operating system or browser.</p>
            </details>
            <details>
              <summary>Voice commands unsupported</summary>
              <p>Voice commands need Chrome or Edge. Keyboard controls still work.</p>
            </details>
          </section>
        </div>
      </div>
    </section>
  );
}

export default Help;
