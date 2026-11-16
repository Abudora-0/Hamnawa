import { useEffect } from "react";

function useHashScroll(hash) {
  useEffect(() => {
    if (!hash) {
      return;
    }

    const target = document.getElementById(hash.slice(1));
    if (!target) {
      return;
    }
    if (!target.matches("a, button, input, select, textarea, summary, [tabindex]")) {
      target.tabIndex = -1;
    }
    target.scrollIntoView({ behavior: "auto", block: "start" });
    target.focus();
  }, [hash]);
}

export default useHashScroll;
