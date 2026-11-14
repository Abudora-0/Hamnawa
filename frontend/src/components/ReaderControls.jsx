import { shortcuts } from "../utils/shortcuts";

function ReaderControls({
  isPlaying,
  speed,
  index,
  total,
  actions,
}) {
  return (
    <div className="reader-controls">
      <div role="group" aria-label="Reading controls">
        <button type="button" onClick={actions.previousSection}>
          Previous section
        </button>
        <button type="button" onClick={actions.previous}>
          Previous sentence
        </button>
        <button type="button" onClick={actions.toggle}>
          {isPlaying ? "Pause" : "Play"}
        </button>
        <button type="button" onClick={actions.next}>
          Next sentence
        </button>
        <button type="button" onClick={actions.nextSection}>
          Next section
        </button>
        <button type="button" onClick={actions.slower}>
          Slower
        </button>
        <button type="button" onClick={actions.faster}>
          Faster
        </button>
        <button type="button" onClick={actions.repeat}>
          Repeat sentence
        </button>
        <button type="button" onClick={actions.goToStart}>
          Start
        </button>
        <button type="button" onClick={actions.goToEnd}>
          End
        </button>
      </div>
      <p>Speed: {speed}x</p>
      <p>Position: {total ? index + 1 : 0} of {total}</p>
      <div>
        <strong>Keyboard shortcuts</strong>
        <ul>
          {shortcuts.map((shortcut) => (
            <li key={`${shortcut.key}-${shortcut.action}`}>
              {shortcut.key}: {shortcut.label}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ReaderControls;
