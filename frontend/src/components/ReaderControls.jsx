import { Link } from "react-router-dom";

function ControlIcon({ type }) {
  const paths = {
    previousSection: "M5 5v14M19 6l-8 6 8 6M5 12h6",
    previous: "M5 5v14M19 6l-8 6 8 6",
    play: "M8 5l11 7-11 7z",
    pause: "M8 5v14M16 5v14",
    next: "M19 5v14M5 6l8 6-8 6",
    nextSection: "M19 5v14M5 6l8 6-8 6M8 12h11",
    slower: "M5 12h14M5 12l5-5M5 12l5 5",
    faster: "M5 12h14M19 12l-5-5M19 12l-5 5",
    repeat: "M5 8h13l-3-3M19 16H6l3 3",
    start: "M6 5v14M19 12H7M7 12l5-5M7 12l5 5",
    end: "M18 5v14M5 12h11M16 12l-5-5M16 12l-5 5",
  };
  return (
    <svg className="control-icon" aria-hidden="true" viewBox="0 0 24 24">
      <path d={paths[type]} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function WaveProgress({ index, total }) {
  return (
    <div className="wave-progress" aria-hidden="true">
      {Array.from({ length: 48 }, (_, barIndex) => (
        <span
          key={barIndex}
          className={barIndex < (total ? ((index + 1) / total) * 48 : 0) ? "is-read" : ""}
          style={{ "--bar-height": `${24 + ((barIndex * 13) % 62)}%` }}
        />
      ))}
    </div>
  );
}

function ReaderControls({
  isPlaying,
  speed,
  index,
  total,
  actions,
}) {
  return (
    <div className="reader-controls panel">
      <WaveProgress index={index} total={total} />
      <div className="now-reading">
        {isPlaying ? (
          <>
            <span>Now reading</span>
            <span className="sound-bars is-playing" aria-hidden="true">
              <i /><i /><i /><i />
            </span>
          </>
        ) : <span>Paused</span>}
      </div>
      <div className="transport-cluster" role="group" aria-label="Reading controls">
        <button className="control-button" type="button" onClick={actions.previousSection}>
          <ControlIcon type="previousSection" /> <span>Previous section</span>
        </button>
        <button className="control-button" type="button" onClick={actions.previous}>
          <ControlIcon type="previous" /> <span>Previous sentence</span>
        </button>
        <button className="control-button play-button" type="button" onClick={actions.toggle}>
          <ControlIcon type={isPlaying ? "pause" : "play"} /> <span>{isPlaying ? "Pause" : "Play"}</span>
        </button>
        <button className="control-button" type="button" onClick={actions.next}>
          <ControlIcon type="next" /> <span>Next sentence</span>
        </button>
        <button className="control-button" type="button" onClick={actions.nextSection}>
          <ControlIcon type="nextSection" /> <span>Next section</span>
        </button>
      </div>
      <div className="speed-controls" role="group" aria-label="Speech speed">
        <button className="btn-ghost" type="button" onClick={actions.slower}>
          <ControlIcon type="slower" /> Slower
        </button>
        <strong>{speed}x</strong>
        <button className="btn-ghost" type="button" onClick={actions.faster}>
          <ControlIcon type="faster" /> Faster
        </button>
      </div>
      <p className="position-text">Position: {total ? index + 1 : 0} of {total}</p>
      <details className="more-controls">
        <summary>More controls</summary>
        <div role="group" aria-label="More reading controls">
          <button className="btn-ghost" type="button" onClick={actions.repeat}>
            <ControlIcon type="repeat" /> Repeat
          </button>
          <button className="btn-ghost" type="button" onClick={actions.goToStart}>
            <ControlIcon type="start" /> Start
          </button>
          <button className="btn-ghost" type="button" onClick={actions.goToEnd}>
            <ControlIcon type="end" /> End
          </button>
        </div>
        <p>Voice commands can hear your speech through your browser&apos;s speech service.</p>
        <Link className="link" to="/help">See all keyboard shortcuts</Link>
      </details>
    </div>
  );
}

export default ReaderControls;
