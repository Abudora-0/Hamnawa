import { useEffect } from "react";

export function useReaderShortcuts(player, changeSpeed) {
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
      } else if (event.key === "=") {
        event.preventDefault();
        changeSpeed(0.25);
      } else if (event.key === "-") {
        event.preventDefault();
        changeSpeed(-0.25);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [changeSpeed, player]);
}
