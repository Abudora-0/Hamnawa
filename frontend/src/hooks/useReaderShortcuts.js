import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { matchShortcut } from "../utils/shortcuts";

export function useReaderShortcuts(actions, screenReaderMode = false) {
  const navigate = useNavigate();

  useEffect(() => {
    function handleKeyDown(event) {
      if (
        ["INPUT", "SELECT", "TEXTAREA"].includes(event.target.tagName)
      ) {
        return;
      }

      const shortcut = matchShortcut(event, screenReaderMode);
      if (!shortcut) {
        return;
      }

      event.preventDefault();
      if (shortcut.action === "focusSearch") {
        document.getElementById("search-input")?.focus();
      } else if (shortcut.action === "focusPage") {
        document.getElementById("page-input")?.focus();
      } else if (shortcut.action === "help") {
        navigate("/help");
      } else {
        actions[shortcut.action]();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [actions, navigate, screenReaderMode]);
}
