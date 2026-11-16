import { useEffect, useState } from "react";
import { useAnnouncer } from "../context/AnnouncementContext";
import { useSettings } from "../context/SettingsContext";
import { speech } from "../services/speech";

export function useReadingPlayer(items) {
  const { speechRate, voiceName, voiceEngine, continuousReading } =
    useSettings();
  const { announce } = useAnnouncer();
  const [index, setIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [repeatVersion, setRepeatVersion] = useState(0);

  useEffect(() => {
    setIndex(0);
    setIsPlaying(false);
    setHasStarted(false);
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
        { rate: speechRate, voiceName, engine: voiceEngine },
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
        announce,
      );
      if (voiceEngine === "cloud" && items[index + 1]) {
        speech.prefetch(items[index + 1].text);
      }
    }, 50);

    return () => {
      cancelled = true;
      clearTimeout(timer);
      speech.cancel();
    };
  }, [
    isPlaying,
    index,
    items,
    speechRate,
    voiceName,
    voiceEngine,
    continuousReading,
    announce,
    repeatVersion,
  ]);

  function play() {
    if (items.length && index >= items.length - 1) {
      setIndex(0);
    }
    setHasStarted(true);
    setIsPlaying(true);
  }

  function pause() {
    setIsPlaying(false);
    announce("Paused");
  }

  function pauseQuietly() {
    setIsPlaying(false);
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

  function goTo(nextIndex) {
    if (!items.length) {
      return;
    }
    setIndex(Math.min(Math.max(nextIndex, 0), items.length - 1));
  }

  function repeat() {
    setRepeatVersion((version) => version + 1);
    setIsPlaying(true);
  }

  return {
    index,
    isPlaying,
    hasStarted,
    play,
    pause,
    pauseQuietly,
    next,
    previous,
    nextSection,
    previousSection,
    goTo,
    repeat,
  };
}
