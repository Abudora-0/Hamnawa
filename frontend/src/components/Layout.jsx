import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import SkipLink from "./SkipLink";
import Logo from "./Logo";
import Footer from "./Footer";
import TopProgress from "./TopProgress";
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
  const headerSentinelRef = useRef(null);
  const { announcement } = useAnnouncer();
  const { screenReaderMode } = useSettings();
  const [toastAnnouncement, setToastAnnouncement] = useState("");
  const [isHeaderCompact, setIsHeaderCompact] = useState(false);

  useEffect(() => {
    if (!headerSentinelRef.current || !("IntersectionObserver" in window)) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => setIsHeaderCompact(!entry.isIntersecting),
      { threshold: 0 },
    );
    observer.observe(headerSentinelRef.current);
    return () => observer.disconnect();
  }, []);

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
    const usesPageTitleHook =
      location.pathname === "/upload" ||
      location.pathname.startsWith("/reader") ||
      !pageNames[firstPath];
    if (!usesPageTitleHook) {
      document.title = `${pageName} | Hamnawa`;
    }

    if (location.hash) {
      const target = document.getElementById(location.hash.slice(1));
      if (target) {
        if (!target.matches("a, button, input, select, textarea, summary, [tabindex]")) {
          target.tabIndex = -1;
        }
        target.scrollIntoView({ behavior: "auto", block: "start" });
        target.focus();
      }
      return;
    }

    window.scrollTo({ top: 0, behavior: "auto" });
    mainRef.current?.focus();
  }, [location.pathname, location.hash]);

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
      <TopProgress />
      <span className="header-sentinel" ref={headerSentinelRef} aria-hidden="true" />
      <header className={`site-header${isHeaderCompact ? " is-compact" : ""}`}>
        <Logo />
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
          <span className="toast-icon">i</span>
          <span>{toastAnnouncement}</span>
          <span className="toast-timer" />
        </div>
      ) : null}
      <Footer />
    </>
  );
}

export default Layout;
