import { synthesizeSpeech } from "../api";
import { isUrdu } from "../../utils/readingQueue";

const cache = new Map();
let requestController = null;
let currentAudio = null;
let currentUrl = "";

function getLanguage(text) {
  return isUrdu(text) ? "ur-PK" : "en-US";
}

function cacheBlob(key, blob) {
  cache.set(key, blob);
  while (cache.size > 4) {
    cache.delete(cache.keys().next().value);
  }
}

async function getBlob(text, voiceName, signal) {
  const key = `${getLanguage(text)}|${voiceName || ""}|${text}`;
  if (cache.has(key)) {
    return cache.get(key);
  }
  const blob = await synthesizeSpeech(
    { text, lang: getLanguage(text), voice: voiceName },
    signal,
  );
  cacheBlob(key, blob);
  return blob;
}

export const cloudSpeech = {
  speak(text, { rate, voiceName }, onEnd) {
    requestController = new AbortController();
    const controller = requestController;
    return getBlob(text, voiceName, controller.signal).then((blob) => {
      if (controller.signal.aborted) {
        return;
      }
      currentUrl = URL.createObjectURL(blob);
      currentAudio = new Audio(currentUrl);
      currentAudio.playbackRate = rate;
      return new Promise((resolve, reject) => {
        currentAudio.onended = () => {
          currentAudio = null;
          URL.revokeObjectURL(currentUrl);
          currentUrl = "";
          onEnd();
          resolve();
        };
        currentAudio.onerror = () => {
          currentAudio = null;
          URL.revokeObjectURL(currentUrl);
          currentUrl = "";
          reject(new Error("Cloud voice playback failed."));
        };
        currentAudio.play().catch(reject);
      });
    });
  },

  cancel() {
    requestController?.abort();
    requestController = null;
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.onended = null;
      currentAudio = null;
    }
    if (currentUrl) {
      URL.revokeObjectURL(currentUrl);
      currentUrl = "";
    }
  },

  prefetch(text, voiceName = "") {
    const controller = new AbortController();
    return getBlob(text, voiceName, controller.signal).catch(() => undefined);
  },
};
