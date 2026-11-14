import { useCallback, useEffect, useRef, useState } from "react";
import { useAnnouncer } from "../context/AnnouncementContext";
import { failureBeep, successBeep } from "../utils/beep";
import { parseCommand } from "../utils/commandParser";

const HELP_MESSAGE =
  "You can say play, pause, next, previous, next section, faster, slower, repeat, bookmark, go to page, search for, and help.";

function getRecognitionConstructor() {
  if (typeof window === "undefined") {
    return null;
  }
  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
}

export function useVoiceCommands(actions, isPlaying) {
  const Recognition = getRecognitionConstructor();
  const supported = Boolean(Recognition);
  const recognitionRef = useRef(null);
  const listeningRef = useRef(false);
  const actionsRef = useRef(actions);
  const isPlayingRef = useRef(isPlaying);
  const [listening, setListening] = useState(false);
  const { announce } = useAnnouncer();

  actionsRef.current = actions;
  isPlayingRef.current = isPlaying;

  const stop = useCallback(() => {
    listeningRef.current = false;
    setListening(false);
    recognitionRef.current?.stop();
  }, []);

  const start = useCallback(() => {
    if (!supported || listeningRef.current) {
      return;
    }
    listeningRef.current = true;
    setListening(true);
    try {
      recognitionRef.current?.start();
    } catch {
      listeningRef.current = false;
      setListening(false);
    }
  }, [supported]);

  useEffect(() => {
    if (!Recognition) {
      return undefined;
    }

    const recognition = new Recognition();
    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.onresult = (event) => {
      const result = event.results[event.results.length - 1];
      const text = result[0].transcript;
      const command = parseCommand(text);
      if (!command) {
        failureBeep();
        announce("Command not understood");
      } else {
        successBeep();
        const commandAction = actionsRef.current[command.action];
        if (command.action === "help") {
          announce(HELP_MESSAGE);
        } else if (commandAction) {
          commandAction(command.value);
        }
      }

      if (
        isPlayingRef.current &&
        command?.action !== "play" &&
        command?.action !== "pause"
      ) {
        actionsRef.current.play();
      }
    };
    recognition.onsoundstart = () => {
      if (isPlayingRef.current) {
        actionsRef.current.pause();
      }
    };
    recognition.onend = () => {
      if (listeningRef.current) {
        setTimeout(() => {
          if (listeningRef.current) {
            try {
              recognition.start();
            } catch {
              return;
            }
          }
        }, 0);
      }
    };
    recognition.onerror = (event) => {
      if (
        event.error === "not-allowed" ||
        event.error === "service-not-allowed"
      ) {
        stop();
        announce(
          "Microphone permission was denied. You can still use the keyboard.",
        );
      } else if (event.error === "network") {
        stop();
        announce("There was a network problem with voice commands.");
      }
    };
    recognitionRef.current = recognition;

    return () => {
      listeningRef.current = false;
      recognition.stop();
      recognitionRef.current = null;
    };
  }, [Recognition, announce, stop]);

  return { supported, listening, start, stop };
}
