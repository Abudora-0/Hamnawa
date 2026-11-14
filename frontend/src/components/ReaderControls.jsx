function ReaderControls({
  isPlaying,
  play,
  pause,
  next,
  previous,
  nextSection,
  previousSection,
  speed,
  onSpeedChange,
  index,
  total,
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
        <button type="button" onClick={() => onSpeedChange(-0.25)}>
          Slower
        </button>
        <button type="button" onClick={() => onSpeedChange(0.25)}>
          Faster
        </button>
      </div>
      <p>Speed: {speed}x</p>
      <p>Position: {total ? index + 1 : 0} of {total}</p>
      <div>
        <strong>Keyboard shortcuts</strong>
        <ul>
          <li>p: play or pause</li>
          <li>n: next sentence</li>
          <li>b: previous sentence</li>
          <li>h: next section</li>
          <li>shift+h: previous section</li>
          <li>plus and minus: change speed</li>
        </ul>
      </div>
    </div>
  );
}

export default ReaderControls;
