import { useCallback, useState } from "react";
import { useAnnouncer } from "../context/AnnouncementContext";
import { useSettings } from "../context/SettingsContext";

export function useReaderActions(player, items, document) {
  const { speechRate, setSpeechRate } = useSettings();
  const { announce } = useAnnouncer();
  const [matches, setMatches] = useState([]);
  const [matchIndex, setMatchIndex] = useState(-1);

  const announcePosition = useCallback(() => {
    const item = items[player.index];
    if (!item) {
      return;
    }
    const sectionItems = items.filter(
      (sectionItem) => sectionItem.sectionId === item.sectionId,
    );
    const itemPosition = sectionItems.findIndex(
      (sectionItem) => sectionItem.id === item.id,
    );
    const locationLabel = document.file_type === "pptx" ? "slide" : "page";
    announce(
      `Section ${item.sectionTitle}, level ${item.sectionLevel}, ${locationLabel} ${item.location}, sentence ${itemPosition + 1} of ${sectionItems.length}`,
    );
  }, [announce, document, items, player.index]);

  const goToPage = useCallback(
    (page) => {
      const locationLabel = document.file_type === "pptx" ? "slide" : "page";
      const pageNumber = Number(page);
      const targetIndex = items.findIndex(
        (item) => item.location >= pageNumber,
      );
      if (pageNumber < 1 || targetIndex === -1) {
        announce(
          `${locationLabel[0].toUpperCase()}${locationLabel.slice(1)} ${pageNumber} not found. This document has ${document.page_count} ${locationLabel}s.`,
        );
        return;
      }
      player.goTo(targetIndex);
      announce(`Moved to ${locationLabel} ${items[targetIndex].location}`);
    },
    [announce, document, items, player],
  );

  const goToTarget = useCallback(
    (targetId, fallbackIndex) => {
      const targetIndex = items.findIndex((item) => item.targetId === targetId);
      player.goTo(targetIndex === -1 ? fallbackIndex : targetIndex);
    },
    [items, player],
  );

  const search = useCallback(
    (text) => {
      const query = text.trim().toLowerCase();
      const nextMatches = query
        ? items.reduce((indexes, item, itemIndex) => {
            if (item.searchText.toLowerCase().includes(query)) {
              indexes.push(itemIndex);
            }
            return indexes;
          }, [])
        : [];
      setMatches(nextMatches);
      if (!nextMatches.length) {
        setMatchIndex(-1);
        announce(query ? `No matches for ${text.trim()}` : "No search text");
        return;
      }
      const atOrAfter = nextMatches.findIndex(
        (match) => match >= player.index,
      );
      const nextMatchIndex = atOrAfter === -1 ? 0 : atOrAfter;
      setMatchIndex(nextMatchIndex);
      player.goTo(nextMatches[nextMatchIndex]);
      announce(
        `${nextMatches.length} matches. Match ${nextMatchIndex + 1} of ${nextMatches.length}.`,
      );
    },
    [announce, items, player],
  );

  const moveMatch = useCallback(
    (direction) => {
      if (!matches.length) {
        announce("No search matches");
        return;
      }
      const nextMatchIndex =
        (matchIndex + direction + matches.length) % matches.length;
      setMatchIndex(nextMatchIndex);
      player.goTo(matches[nextMatchIndex]);
      announce(`Match ${nextMatchIndex + 1} of ${matches.length}`);
    },
    [announce, matchIndex, matches, player],
  );

  const changeSpeed = useCallback(
    (amount) => {
      const nextRate = Math.min(3, Math.max(0.5, speechRate + amount));
      setSpeechRate(nextRate);
      announce(`Speed ${nextRate} times normal`);
    },
    [announce, setSpeechRate, speechRate],
  );

  const actions = {
    play: player.play,
    pause: player.pause,
    toggle: player.isPlaying ? player.pause : player.play,
    next: player.next,
    previous: player.previous,
    nextSection: player.nextSection,
    previousSection: player.previousSection,
    repeat: player.repeat,
    goToStart: () => player.goTo(0),
    goToEnd: () => player.goTo(items.length - 1),
    goToSection: (sectionId) => {
      const sectionIndex = items.findIndex(
        (item) => item.sectionId === sectionId,
      );
      if (sectionIndex !== -1) {
        player.goTo(sectionIndex);
      }
    },
    goToPage,
    goToTarget,
    search,
    nextMatch: () => moveMatch(1),
    previousMatch: () => moveMatch(-1),
    announcePosition,
    faster: () => changeSpeed(0.25),
    slower: () => changeSpeed(-0.25),
    matchCount: matches.length,
    currentMatch: matchIndex + 1,
  };

  return actions;
}
