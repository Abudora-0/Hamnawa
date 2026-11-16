import { PlayIcon } from "./icons";

function HeroArt() {
  return (
    <div className="hero-art" aria-hidden="true">
      <div className="hero-shape hero-shape-circle" />
      <div className="hero-shape hero-shape-petal" />
      <div className="document-sheet">
        <span className="sheet-kicker">HAMNAWA / NOTES</span>
        <strong>Listening makes ideas stick</strong>
        <span className="sheet-line sheet-line-short" />
        <span className="sheet-line" />
        <span className="sheet-line sheet-line-highlight" />
        <span className="sheet-line sheet-line-short" />
        <span className="sheet-line" />
        <span className="sheet-line sheet-line-highlight" />
        <span className="sheet-line sheet-line-short" />
      </div>
      <div className="player-pill">
        <span className="hero-play"><PlayIcon /></span>
        <span className="hero-waveform">
          <i /><i /><i /><i /><i /><i /><i />
        </span>
        <span className="hero-progress" />
      </div>
      <div className="hero-urdu-card" lang="ur">علم سن کر یاد رہتا ہے</div>
    </div>
  );
}

export default HeroArt;
