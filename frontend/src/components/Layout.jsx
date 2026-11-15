import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import SkipLink from "./SkipLink";
import { useAnnouncer } from "../context/AnnouncementContext";
import { useSettings } from "../context/SettingsContext";

const pageNames = {
  "/": "Home",
  "/upload": "Upload",
  "/reader": "Reader",
  "/speak": "Speak Aloud",
  "/settings": "Settings",
  "/help": "Help",
};

function Layout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const mainRef = useRef(null);
  const hasRendered = useRef(false);
  const { announcement } = useAnnouncer();
  const { screenReaderMode } = useSettings();
  const [toastAnnouncement, setToastAnnouncement] = useState("");

  useEffect(() => {
    function handleHelpShortcut(event) {
      const isFormField = ["INPUT", "SELECT", "TEXTAREA"].includes(
        event.target.tagName,
      );
      const isHelpShortcut = screenReaderMode
        ? event.code === "KeyQ" &&
          event.altKey &&
          event.shiftKey &&
          !event.ctrlKey &&
          !event.metaKey
        : event.key === "?" &&
          !event.altKey &&
          !event.ctrlKey &&
          !event.metaKey;
      if (!isHelpShortcut || isFormField) {
        return;
      }
      event.preventDefault();
      navigate("/help");
    }

    window.addEventListener("keydown", handleHelpShortcut);
    return () => window.removeEventListener("keydown", handleHelpShortcut);
  }, [navigate, screenReaderMode]);

  useEffect(() => {
    const firstPath = `/${location.pathname.split("/")[1]}`;
    const pageName = pageNames[firstPath] || "This page is not here";
    document.title = `${pageName} | Hamnawa`;

    if (!hasRendered.current) {
      hasRendered.current = true;
      return;
    }

    mainRef.current?.focus();
  }, [location.pathname]);

  useEffect(() => {
    if (typeof announcement !== "string" || !announcement) {
      return undefined;
    }
    setToastAnnouncement(announcement);
    const timeout = window.setTimeout(() => setToastAnnouncement(""), 4000);
    return () => window.clearTimeout(timeout);
  }, [announcement]);

  return (
    <>
      <SkipLink />
      <header className="site-header">
        <Link className="brand" to="/" aria-label="Hamnawa home">
          Hamnawa <span className="brand-urdu" lang="ur">ہم نوا</span>
        </Link>
        <Navbar />
      </header>
      <main id="main" ref={mainRef} tabIndex={-1}>
        {children}
      </main>
      <div className="live-region" aria-live="polite" aria-atomic="true">
        {announcement}
      </div>
      {toastAnnouncement ? (
        <div className="toast panel" aria-hidden="true">
          {toastAnnouncement}
        </div>
      ) : null}
      <footer className="site-footer">
        <p>Hamnawa. Made so every student can listen.</p>
        <nav aria-label="Footer navigation">
          <ul className="footer-links">
            <li><Link className="link" to="/help">Help</Link></li>
            <li><Link className="link" to="/settings">Settings</Link></li>
          </ul>
        </nav>
        <p>Documents are deleted from the server after 24 hours.</p>
      </footer>
    </>
  );
}

export default Layout;
