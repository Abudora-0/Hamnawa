import { isUrdu } from "../../utils/readingQueue";

export const browserSpeech = {
  isSupported() {
    return typeof window !== "undefined" && "speechSynthesis" in window;
  },

  getVoices() {
    return this.isSupported() ? window.speechSynthesis.getVoices() : [];
  },

  onVoicesChanged(callback) {
    if (!this.isSupported()) {
      return () => {};
    }
    window.speechSynthesis.addEventListener("voiceschanged", callback);
    return () =>
      window.speechSynthesis.removeEventListener("voiceschanged", callback);
  },

  speak(text, { rate, voiceName }, onEnd) {
    if (!this.isSupported()) {
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    if (isUrdu(text)) {
      utterance.lang = "ur-PK";
    } else {
      const voice = this.getVoices().find((item) => item.name === voiceName);
      if (voice) {
        utterance.voice = voice;
      }
    }
    utterance.rate = rate;
    let finished = false;
    const finish = () => {
      if (!finished) {
        finished = true;
        onEnd();
      }
    };
    utterance.onend = finish;
    utterance.onerror = finish;
    window.speechSynthesis.speak(utterance);
  },

  cancel() {
    if (this.isSupported()) {
      window.speechSynthesis.cancel();
    }
  },
};
