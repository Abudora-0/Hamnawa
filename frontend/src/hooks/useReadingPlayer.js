import { useEffect, useState } from "react";
import { useAnnouncer } from "../context/AnnouncementContext";
import { useSettings } from "../context/SettingsContext";
import { speech } from "../services/speech";

export function useReadingPlayer(items) {
  const { speechRate, voiceName, continuousReading } = useSettings();
  const { announce } = useAnnouncer();
  const [index, setIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    setIndex(0);
    setIsPlaying(false);
  }, [items]);

  useEffect(() => {
    if (!isPlaying || !items[index]) {
      return undefined;
    }

    let cancelled = false;
    const timer = setTimeout(() => {
      if (cancelled) {
        return;
      }
      speech.speak(
        items[index].text,
        { rate: speechRate, voiceName },
        () => {
          if (cancelled) {
            return;
          }
          if (index === items.length - 1) {
            setIsPlaying(false);
            announce("End of document");
          } else if (
            !continuousReading &&
            items[index + 1].sectionId !== items[index].sectionId
          ) {
            setIndex(index + 1);
            setIsPlaying(false);
            announce("End of section");
          } else {
            setIndex(index + 1);
          }
        },
      );
    }, 50);

    return () => {
      cancelled = true;
      clearTimeout(timer);
      speech.cancel();
    };
  }, [isPlaying, index, items, speechRate, voiceName, continuousReading, announce]);

  function play() {
    if (items.length && index >= items.length - 1) {
      setIndex(0);
    }
    setIsPlaying(true);
  }

  function pause() {
    setIsPlaying(false);
    announce("Paused");
  }

  function next() {
    setIndex((currentIndex) =>
      Math.min(currentIndex + 1, Math.max(items.length - 1, 0)),
    );
  }

  function previous() {
    setIndex((currentIndex) => Math.max(currentIndex - 1, 0));
  }

  function nextSection() {
    const nextHeading = items.findIndex(
      (item, itemIndex) => itemIndex > index && item.isHeading,
    );
    if (nextHeading !== -1) {
      setIndex(nextHeading);
    }
  }

  function previousSection() {
    const headingIndexes = items.reduce((indexes, item, itemIndex) => {
      if (item.isHeading && itemIndex < index) {
        indexes.push(itemIndex);
      }
      return indexes;
    }, []);
    if (headingIndexes.length) {
      setIndex(headingIndexes[headingIndexes.length - 1]);
    }
  }

  return {
    index,
    isPlaying,
    play,
    pause,
    next,
    previous,
    nextSection,
    previousSection,
    atEnd: items.length > 0 && index >= items.length - 1,
  };
}
