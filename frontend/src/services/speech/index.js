import { browserSpeech } from "./browserSpeech";
import { cloudSpeech } from "./cloudSpeech";

let cloudFailureNotified = false;

export const speech = {
  isSupported: browserSpeech.isSupported.bind(browserSpeech),
  getVoices: browserSpeech.getVoices.bind(browserSpeech),
  onVoicesChanged: browserSpeech.onVoicesChanged.bind(browserSpeech),

  speak(text, options, onEnd, notify) {
    if (options.engine !== "cloud") {
      browserSpeech.speak(text, options, onEnd, (error) => notify?.(error));
      return;
    }

    cloudSpeech.speak(text, options, onEnd).catch((error) => {
      if (error.name === "AbortError") {
        return;
      }
      cloudSpeech.cancel();
      browserSpeech.speak(text, options, onEnd, (browserError) =>
        notify?.(browserError),
      );
      if (!cloudFailureNotified) {
        cloudFailureNotified = true;
        notify?.("Cloud voice failed. Using the device voice.");
      }
    });
  },

  cancel() {
    cloudSpeech.cancel();
    browserSpeech.cancel();
  },

  prefetch(text) {
    return cloudSpeech.prefetch(text);
  },
};
