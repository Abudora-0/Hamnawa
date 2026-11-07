import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import SkipLink from "./SkipLink";
import { useAnnouncer } from "../context/AnnouncementContext";

const pageNames = {
  "/": "Home",
  "/upload": "Upload",
  "/reader": "Reader",
  "/speak": "Speak Aloud",
  "/settings": "Settings",
};

function Layout({ children }) {
  const location = useLocation();
  const mainRef = useRef(null);
  const { announcement } = useAnnouncer();

  useEffect(() => {
    const pageName = pageNames[location.pathname] || "Hamnawa";
    document.title = `${pageName} | Hamnawa`;
    mainRef.current?.focus();
  }, [location.pathname]);

  return (
    <>
      <SkipLink />
      <header className="site-header">
        <a className="brand" href="/">
          Hamnawa
        </a>
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
