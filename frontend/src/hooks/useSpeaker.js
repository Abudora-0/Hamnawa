import { useEffect, useRef, useState } from "react";
import { useAnnouncer } from "../context/AnnouncementContext";
import { useSettings } from "../context/SettingsContext";
import { speech } from "../services/speech";
import { splitSentences } from "../utils/readingQueue";

export function useSpeaker() {
  const { speechRate, voiceName } = useSettings();
  const { announce } = useAnnouncer();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const generationRef = useRef(0);

  function stop() {
    generationRef.current += 1;
    speech.cancel();
    setIsSpeaking(false);
    announce("Stopped");
  }

  function speak(text) {
    const sentences = splitSentences(text);
    if (!sentences.length) {
      return;
    }

    generationRef.current += 1;
    const generation = generationRef.current;
    speech.cancel();
    setIsSpeaking(true);
    announce("Speaking");

    function speakSentence(sentenceIndex) {
      if (generation !== generationRef.current) {
        return;
      }

      speech.speak(
        sentences[sentenceIndex],
        { rate: speechRate, voiceName },
        () => {
          if (generation !== generationRef.current) {
            return;
          }
          if (sentenceIndex === sentences.length - 1) {
            setIsSpeaking(false);
            announce("Finished speaking");
            return;
          }
          speakSentence(sentenceIndex + 1);
        },
      );
    }

    speakSentence(0);
  }

  useEffect(
    () => () => {
      generationRef.current += 1;
      speech.cancel();
    },
    [],
  );

  return { speak, stop, isSpeaking };
}
