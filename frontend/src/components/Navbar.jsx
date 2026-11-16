import { useEffect, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useAnnouncer } from "../context/AnnouncementContext";
import { useSettings } from "../context/SettingsContext";
import {
  HelpIcon,
  HomeIcon,
  MenuIcon,
  ReaderIcon,
  SettingsIcon,
  SpeakIcon,
  ThemeIcon,
  UploadIcon,
} from "./icons";

const links = [
  { to: "/", label: "Home", end: true, Icon: HomeIcon },
  { to: "/upload", label: "Upload", Icon: UploadIcon },
  { to: "/reader", label: "Reader", Icon: ReaderIcon },
  { to: "/speak", label: "Speak Aloud", Icon: SpeakIcon },
  { to: "/settings", label: "Settings", Icon: SettingsIcon },
  { to: "/help", label: "Help", Icon: HelpIcon },
];

const themes = ["light", "dark", "contrast"];
const themeLabels = {
  light: "Light",
  dark: "Dark",
  contrast: "High contrast",
};

function Navbar() {
  const location = useLocation();
  const { theme, setTheme } = useSettings();
  const { announce } = useAnnouncer();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuButtonRef = useRef(null);
  const isUploadPage = location.pathname === "/upload";

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    function handleEscape(event) {
      if (event.key === "Escape" && isMenuOpen) {
        setIsMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    }

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isMenuOpen]);

  function cycleTheme() {
    const nextTheme = themes[(themes.indexOf(theme) + 1) % themes.length];
    setTheme(nextTheme);
    announce(`Theme changed to ${themeLabels[nextTheme]}`);
  }

  return (
    <div className="nav-tools">
      <button
        ref={menuButtonRef}
        className="menu-button btn-ghost"
        type="button"
        aria-expanded={isMenuOpen}
        aria-controls="main-nav-links"
        onClick={() => setIsMenuOpen((open) => !open)}
      >
        <MenuIcon open={isMenuOpen} />
        <span>Menu</span>
      </button>
      <nav aria-label="Main navigation">
        <ul
          id="main-nav-links"
          className={`nav-list${isMenuOpen ? " is-open" : ""}`}
        >
          {links.map((link) => {
            const Icon = link.Icon;
            return (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.end}
                  className={({ isActive }) => (isActive ? "active" : "")}
                  aria-current={
                    (link.end
                      ? location.pathname === link.to
                      : location.pathname.startsWith(link.to))
                      ? "page"
                      : undefined
                  }
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Icon />
                  <span>{link.label}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="nav-utilities">
        {!isUploadPage ? (
          <NavLink className="btn upload-nav-button" to="/upload">
            <UploadIcon />
            <span>Upload</span>
          </NavLink>
        ) : null}
        <button
          className="theme-button btn-ghost"
          type="button"
          onClick={cycleTheme}
          aria-label={`Theme: ${themeLabels[theme]}. Switch to ${
            themeLabels[themes[(themes.indexOf(theme) + 1) % themes.length]]
          }`}
        >
          <ThemeIcon theme={theme} />
          <span>{themeLabels[theme]}</span>
        </button>
      </div>
    </div>
  );
}

export default Navbar;
