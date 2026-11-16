import { Link } from "react-router-dom";
import Logo from "./Logo";

function Footer() {
  function handleBackToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
    document.getElementById("main")?.focus();
  }

  return (
    <footer className="site-footer">
      <span className="thread thread-divider" aria-hidden="true" />
      <div className="footer-grid">
        <section className="footer-brand">
          <Logo />
          <p>Study material that speaks your way.</p>
          <p lang="ur">اپنے انداز میں پڑھیں اور سنیں</p>
        </section>
        <nav aria-label="Explore">
          <h2>Explore</h2>
          <Link to="/">Home</Link>
          <Link to="/upload">Upload</Link>
          <Link to="/reader">Reader</Link>
          <Link to="/speak">Speak Aloud</Link>
        </nav>
        <nav aria-label="Support">
          <h2>Support</h2>
          <Link to="/help">Help</Link>
          <Link to="/help#keyboard-shortcuts">Keyboard shortcuts</Link>
          <Link to="/settings">Settings</Link>
        </nav>
        <div className="privacy-card panel">
          <h2>Private by default</h2>
          <p>No accounts. Documents are deleted after 24 hours.</p>
          <Link className="link" to="/settings">Erase saved data in Settings</Link>
        </div>
      </div>
      <div className="footer-bottom">
        <p>Hamnawa, a university software engineering project</p>
        <button className="btn-ghost" type="button" onClick={handleBackToTop}>
          Back to top
        </button>
      </div>
    </footer>
  );
}

export default Footer;
