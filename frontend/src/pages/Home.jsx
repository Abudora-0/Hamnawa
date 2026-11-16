import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import HeroArt from "../components/HeroArt";
import { useAnnouncer } from "../context/AnnouncementContext";
import { useDocument } from "../context/DocumentContext";
import useReveal from "../hooks/useReveal";
import { sampleDocument } from "../services/mockData";
import { getRecent } from "../utils/documentMemory";
import { relativeTime } from "../utils/relativeTime";
import { PlayIcon } from "../components/icons";

function RevealSection({ children, className = "" }) {
  const reveal = useReveal();
  return (
    <section ref={reveal.ref} className={`${reveal.className} ${className}`}>
      {children}
    </section>
  );
}

function Home() {
  const [recentDocuments, setRecentDocuments] = useState([]);
  const { setDocument } = useDocument();
  const { announce } = useAnnouncer();
  const navigate = useNavigate();

  useEffect(() => {
    setRecentDocuments(getRecent());
  }, []);

  function loadSample() {
    setDocument(sampleDocument);
    announce(`Document ready. ${sampleDocument.sections.length} sections found.`);
    navigate(`/reader/${sampleDocument.id}`);
  }

  return (
    <section className="home-page">
      <section className="home-hero">
        <div className="hero-copy-column">
          <p className="eyebrow"><span aria-hidden="true">01 / </span>Study with your ears</p>
          <h1>
            Study material that <span className="wave-underline">speaks</span>{" "}
            your way.
          </h1>
          <p className="hero-copy">
            Turn your notes and slides into a calm reading experience you can
            follow with your eyes, keyboard, or voice.
          </p>
          <div className="hero-actions">
            <Link className="button-link" to="/upload">Upload a document</Link>
            <button className="btn-ghost" type="button" onClick={loadSample}>
              Try the sample
            </button>
          </div>
          <ul className="hero-chips" aria-label="Hamnawa features">
            <li>PDF and PPTX</li>
            <li>English and Urdu</li>
            <li>Deleted after 24 hours</li>
          </ul>
        </div>
        <HeroArt />
      </section>

      <RevealSection className="home-band">
        <p className="eyebrow"><span aria-hidden="true">02 / </span>A simple rhythm</p>
        <h2>How it works</h2>
        <span className="thread thread-under" aria-hidden="true" />
        <ol className="steps-list">
          <li>
            <strong>Choose a file</strong>
            <span>Bring a PDF or slide deck from your device.</span>
          </li>
          <li>
            <strong>We prepare it</strong>
            <span>Hamnawa finds sections and makes them easy to follow.</span>
          </li>
          <li>
            <strong>You listen</strong>
            <span>Read at your pace with speech, keyboard, or voice.</span>
          </li>
        </ol>
      </RevealSection>

      <RevealSection className="home-band">
        <p className="eyebrow"><span aria-hidden="true">03 / </span>Built around you</p>
        <h2>Made for listening</h2>
        <span className="thread thread-under" aria-hidden="true" />
        <div className="feature-bento">
          <article className="feature-tile feature-tile-large">
            <span className="tile-number">01</span>
            <h3>Keyboard first</h3>
            <p>Keep your hands on the keys.</p>
            <div className="key-row" aria-label="Keyboard shortcuts">
              <kbd>Space</kbd><kbd>N</kbd><kbd>P</kbd>
            </div>
          </article>
          <article className="feature-tile feature-tile-tall">
            <span className="tile-number">02</span>
            <h3>Voice commands</h3>
            <p className="say-chip">“next section”</p>
            <p className="say-chip">“repeat”</p>
          </article>
          <article className="feature-tile">
            <span className="tile-number">03</span>
            <h3>English and Urdu</h3>
            <p>Learn in the language that makes the idea clear.</p>
            <p className="bilingual-sample">Listen, learn <span lang="ur">سنیں، سیکھیں</span></p>
          </article>
          <article className="feature-tile feature-tile-wide">
            <span className="tile-number">04</span>
            <h3>Private by default</h3>
            <p>Every uploaded document has a <strong className="time-badge">24 hour</strong> life on the server.</p>
          </article>
        </div>
      </RevealSection>

      <RevealSection className="home-band action-preview-band">
        <div>
          <p className="eyebrow"><span aria-hidden="true">04 / </span>See it in action</p>
          <h2>A reader that keeps your place.</h2>
          <span className="thread thread-under" aria-hidden="true" />
          <p>Follow a highlighted sentence, change the speed, and move between sections without losing your focus.</p>
          <button className="btn" type="button" onClick={loadSample}>Try the sample</button>
        </div>
        <div className="reader-preview" aria-hidden="true">
          <div className="preview-title">Introduction to Software Engineering <span className="tag">PDF</span></div>
          <div className="preview-player"><span className="hero-play"><PlayIcon /></span><span className="preview-bars"><i /><i /><i /><i /><i /></span><span>01:24</span></div>
          <p>Software engineering builds useful software through an organized process.</p>
          <p className="preview-highlight">Good software is reliable, usable, and easy to maintain.</p>
        </div>
      </RevealSection>

      {recentDocuments.length ? (
        <RevealSection className="home-band">
          <p className="eyebrow"><span aria-hidden="true">05 / </span>Pick up where you left off</p>
          <h2>Recent documents</h2>
          <span className="thread thread-under" aria-hidden="true" />
          <ul className="recent-list">
            {recentDocuments.map((document) => (
              <li key={document.id}>
                <span>
                  <strong>{document.title}</strong>
                  <span className="tag">{document.file_type}</span>
                  <small>{relativeTime(document.opened_at)}</small>
                </span>
                <Link className="link link-arrow" to={`/reader/${document.id}`}>Resume</Link>
              </li>
            ))}
          </ul>
        </RevealSection>
      ) : null}

      <RevealSection className="home-band faq-band">
        <p className="eyebrow"><span aria-hidden="true">06 / </span>Questions, answered</p>
        <h2>Good to know</h2>
        <span className="thread thread-under" aria-hidden="true" />
        <details>
          <summary>Which files work?</summary>
          <p>Hamnawa accepts PDF and PPTX files up to 20 MB.</p>
        </details>
        <details>
          <summary>Is my document private?</summary>
          <p>Your document is sent to the server for processing and deleted after 24 hours.</p>
        </details>
        <details>
          <summary>Does it work offline?</summary>
          <p>Device speech can work offline when your browser has a local voice installed. Upload processing needs the server.</p>
        </details>
        <details>
          <summary>Which languages are supported?</summary>
          <p>Hamnawa supports English and Urdu reading, with automatic language detection or a language hint.</p>
        </details>
      </RevealSection>

      <section className="closing-band">
        <p className="eyebrow"><span aria-hidden="true">07 / </span>Start your thread</p>
        <h2>Make your next study session easier to hear.</h2>
        <div className="hero-actions">
          <Link className="button-link" to="/upload">Upload a document</Link>
          <button className="btn-ghost" type="button" onClick={loadSample}>Try the sample</button>
        </div>
      </section>
    </section>
  );
}

export default Home;
