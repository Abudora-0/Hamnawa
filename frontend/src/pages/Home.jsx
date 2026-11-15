import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAnnouncer } from "../context/AnnouncementContext";
import { useDocument } from "../context/DocumentContext";
import { sampleDocument } from "../services/mockData";
import { getRecent } from "../utils/documentMemory";

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
      <div className="home-hero">
        <div>
          <p className="eyebrow">A companion for your study time</p>
          <h1>Study material that speaks your way.</h1>
          <p className="hero-copy">
            Turn your notes and slides into a calm reading experience you can
            follow with your eyes, keyboard, or voice.
          </p>
          <div className="hero-actions">
            <Link className="button-link" to="/upload">Upload a document</Link>
            <button className="btn-ghost" type="button" onClick={loadSample}>Try the sample</button>
          </div>
        </div>
        <div className="hero-wave" aria-hidden="true">
          <div className="wave-bars">
            {Array.from({ length: 40 }, (_, index) => (
              <span key={index} style={{ "--bar-height": `${24 + ((index * 17) % 70)}%` }} />
            ))}
          </div>
          <span className="hero-urdu" lang="ur">ہم نوا</span>
        </div>
      </div>
      <span className="thread thread-divider" aria-hidden="true" />
      <section>
        <h2>How it works</h2>
        <span className="thread thread-under" aria-hidden="true" />
        <ol className="steps-list">
          <li><strong>Choose a file</strong><span>Bring a PDF or slide deck from your device.</span></li>
          <li><strong>We prepare it</strong><span>Hamnawa finds the sections and makes them easy to follow.</span></li>
          <li><strong>You listen</strong><span>Read at your pace with speech, keyboard, or voice commands.</span></li>
        </ol>
      </section>
      <span className="thread thread-divider" aria-hidden="true" />
      <section>
        <h2>Made for listening</h2>
        <span className="thread thread-under" aria-hidden="true" />
        <ul className="editorial-list">
          <li><span className="editorial-glyph" aria-hidden="true"><svg viewBox="0 0 24 24"><rect x="3" y="6" width="18" height="12" rx="1" fill="none" stroke="currentColor" strokeWidth="2" /><path d="M6 10h2m2 0h2m2 0h2M6 14h8" stroke="currentColor" strokeWidth="2" /></svg></span><div><strong>Keyboard first</strong><span>Every important action is reachable without a mouse.</span></div></li>
          <li><span className="editorial-glyph" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M9 10V7a3 3 0 0 1 6 0v3M6 10h12v8H6z" fill="none" stroke="currentColor" strokeWidth="2" /><path d="M4 13a8 8 0 0 0 16 0" fill="none" stroke="currentColor" strokeWidth="2" /></svg></span><div><strong>Voice commands</strong><span>Move through a document while your hands are busy.</span></div></li>
          <li><span className="editorial-glyph" aria-hidden="true"><svg viewBox="0 0 24 24"><circle cx="8" cy="8" r="4" fill="none" stroke="currentColor" strokeWidth="2" /><path d="M3 18c1-3 9-3 10 0M15 5l6 6m0-6-6 6" fill="none" stroke="currentColor" strokeWidth="2" /></svg></span><div><strong>English and Urdu</strong><span>Choose the language that makes your material clearer.</span></div></li>
          <li><span className="editorial-glyph" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 10V7a7 7 0 0 1 14 0v3M4 10h16v10H4z" fill="none" stroke="currentColor" strokeWidth="2" /></svg></span><div><strong>Private by default</strong><span>Your uploaded documents are deleted from the server after 24 hours.</span></div></li>
        </ul>
      </section>
      {recentDocuments.length ? (
        <section>
          <h2>Recent documents</h2>
          <ul className="recent-list">
            {recentDocuments.map((document) => (
              <li key={document.id}>
                <span>
                  <strong>{document.title}</strong>{" "}
                  <span className="tag">{document.file_type}</span>
                </span>
                <Link className="link link-arrow" to={`/reader/${document.id}`}>Resume</Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </section>
  );
}

export default Home;
