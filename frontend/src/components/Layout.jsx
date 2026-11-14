import { useEffect, useRef } from "react";
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
    const pageName = pageNames[firstPath] || "Hamnawa";
    document.title = `${pageName} | Hamnawa`;

    if (!hasRendered.current) {
      hasRendered.current = true;
      return;
    }

    mainRef.current?.focus();
  }, [location.pathname]);

  return (
    <>
      <SkipLink />
      <header className="site-header">
        <Link className="brand" to="/">
          Hamnawa
        </Link>
        <Navbar />
      </header>
      <main id="main" ref={mainRef} tabIndex={-1}>
        {children}
      </main>
      <div className="live-region" aria-live="polite" aria-atomic="true">
        {announcement}
      </div>
    </>
  );
}

export default Layout;
