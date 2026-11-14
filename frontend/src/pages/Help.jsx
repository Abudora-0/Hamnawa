import { getShortcutLabel, getShortcuts } from "../utils/shortcuts";
import { useSettings } from "../context/SettingsContext";

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
  "go to page",
  "search for",
  "help",
];

function Help() {
  const { screenReaderMode } = useSettings();
  const activeShortcuts = getShortcuts(screenReaderMode);

  return (
    <section>
      <h1>Help</h1>

      <h2>Getting started</h2>
      <ol>
        <li>Upload a PDF or PowerPoint file.</li>
        <li>Open the reader and choose Play or use the keyboard shortcuts.</li>
        <li>Adjust speech, display, and accessibility settings as needed.</li>
      </ol>

      <h2>Keyboard shortcuts</h2>
      <table>
        <caption>Shortcuts for the current mode</caption>
        <thead>
          <tr>
            <th scope="col">Key</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
          {activeShortcuts.map((shortcut) => (
            <tr key={`${shortcut.action}-${shortcut.srCode}`}>
              <td>{getShortcutLabel(shortcut, screenReaderMode)}</td>
              <td>{shortcut.label}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Voice commands</h2>
      <p>Say one of these commands while voice commands are on:</p>
      <ul>
        {voiceCommands.map((command) => (
          <li key={command}>{command}</li>
        ))}
      </ul>

      <h2>Speak Aloud</h2>
      <p>
        Speak Aloud lets you type a message and have it spoken one sentence at
        a time. It also provides quick phrases and a history of recent speech.
      </p>

      <h2>Troubleshooting</h2>
      <h3>No sound</h3>
      <p>Check your device volume, selected voice, and speech speed settings.</p>
      <h3>Urdu voice missing</h3>
      <p>Install or enable an Urdu voice in your operating system or browser.</p>
      <h3>Voice commands unsupported</h3>
      <p>
        Voice commands need Chrome or Edge. Keyboard controls still work.
      </p>
    </section>
  );
}

export default Help;
