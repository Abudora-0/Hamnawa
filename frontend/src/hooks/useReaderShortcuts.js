import { useEffect } from "react";
import { useAnnouncer } from "../context/AnnouncementContext";
import { useSettings } from "../context/SettingsContext";

export function useReaderShortcuts(player) {
  const { speechRate, setSpeechRate } = useSettings();
  const { announce } = useAnnouncer();

  useEffect(() => {
    function handleKeyDown(event) {
      if (
        event.ctrlKey ||
        event.altKey ||
        event.metaKey ||
        ["INPUT", "SELECT", "TEXTAREA"].includes(event.target.tagName)
      ) {
        return;
      }

      if (event.key === "p") {
        event.preventDefault();
        if (player.isPlaying) {
          player.pause();
        } else {
          player.play();
        }
      } else if (event.key === "n") {
        event.preventDefault();
        player.next();
      } else if (event.key === "b") {
        event.preventDefault();
        player.previous();
      } else if (event.key === "h") {
        event.preventDefault();
        player.nextSection();
      } else if (event.key === "H") {
        event.preventDefault();
        player.previousSection();
      } else if (event.key === "+") {
        event.preventDefault();
        changeSpeed(0.25);
      } else if (event.key === "-") {
        event.preventDefault();
        changeSpeed(-0.25);
      }
    }

    function changeSpeed(amount) {
      const nextRate = Math.min(3, Math.max(0.5, speechRate + amount));
      setSpeechRate(nextRate);
      announce(`Speed ${nextRate} times`);
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [announce, player, setSpeechRate, speechRate]);
}
