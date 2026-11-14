import { shortcuts } from "../utils/shortcuts";

function ReaderControls({
  isPlaying,
  play,
  pause,
  next,
  previous,
  nextSection,
  previousSection,
  repeat,
  goToStart,
  goToEnd,
  speed,
  index,
  total,
  actions,
}) {
  return (
    <div className="reader-controls">
      <div role="group" aria-label="Reading controls">
        <button type="button" onClick={previousSection}>
          Previous section
        </button>
        <button type="button" onClick={previous}>
          Previous sentence
        </button>
        <button type="button" onClick={isPlaying ? pause : play}>
          {isPlaying ? "Pause" : "Play"}
        </button>
        <button type="button" onClick={next}>
          Next sentence
        </button>
        <button type="button" onClick={nextSection}>
          Next section
        </button>
        <button type="button" onClick={actions.slower}>
          Slower
        </button>
        <button type="button" onClick={actions.faster}>
          Faster
        </button>
        <button type="button" onClick={repeat}>
          Repeat sentence
        </button>
        <button type="button" onClick={goToStart}>
          Start
        </button>
        <button type="button" onClick={goToEnd}>
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
